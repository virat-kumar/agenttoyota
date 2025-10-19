#!/usr/bin/env bash
set -euo pipefail

# Usage: bash setup.sh [project-folder]
APP_DIR="${1:-toyota-finance}"

echo ">> Installing basics..."
sudo apt update -y
sudo apt install -y curl git

echo ">> Installing Node via nvm..."
if ! command -v nvm >/dev/null 2>&1; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 22 >/dev/null
nvm use 22 >/dev/null

echo ">> Creating Vite React app (if missing): $APP_DIR"
if [ ! -d "$APP_DIR" ]; then
  npm create vite@latest "$APP_DIR" -- --template react
fi
cd "$APP_DIR"

echo ">> Installing deps..."
npm i

echo ">> Tailwind setup..."
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Tailwind config
cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
EOF

# Tailwind CSS entry
mkdir -p src
cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
EOF

# Main entry to render your component
cat > src/main.jsx <<'EOF'
import React from "react";
import ReactDOM from "react-dom/client";
import ToyotaAuthApp from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToyotaAuthApp />
  </React.StrictMode>
);
EOF

# Ensure dev server runs on port 3000 always
echo ">> Forcing dev port 3000 in package.json..."
node - "$PWD/package.json" <<'EOF'
const fs = require('fs');
const f = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(f,'utf8'));
pkg.scripts ||= {};
pkg.scripts.dev = "vite --port 3000 ";
fs.writeFileSync(f, JSON.stringify(pkg, null, 2));
EOF

# Make an empty App if you haven't pasted your code yet
if [ ! -f src/App.jsx ]; then
  cat > src/App.jsx <<'EOF'
export default function ToyotaAuthApp() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Toyota Finance Demo</h1>
        <p>Paste your full App.jsx code here to replace this placeholder.</p>
      </div>
    </div>
  );
}
EOF
fi

echo
echo "✅ Setup done."
echo "1) Open src/App.jsx and REPLACE with your provided Toyota code."
echo "2) Start on port 3000:"
echo "   npm run dev"
echo
echo ">> On a cloud VM? Bind to all interfaces:"
echo "   npm run dev -- --host 0.0.0.0"
echo "   (then hit http://<your-vm-ip>:3000 )"
