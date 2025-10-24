
# Toyota Finance UI (Demo)

A React + Vite + Tailwind (v4 style `@import "tailwindcss";`) demo that simulates:

- Login / Sign up (no backend — just transitions)
- Home with two choices: **Customize Your Financing** and **Ask Chatbot**
- Profile form (income, credit score, ZIP, etc.)
- Recommendations screen (mock 3×Loans + 3×Leases with Toyota images from Wikipedia/Commons)
- 1‑second loading overlay between screen transitions

## Quick Start

```bash
npm i
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Notes

- All actions are simulated and do not call any backend.
- Styles use Tailwind v4 syntax via `@import "tailwindcss";` in `src/styles/index.css`.
- If you run into Tailwind processing issues, ensure `postcss` is set up (included) and that you have a modern Node.
