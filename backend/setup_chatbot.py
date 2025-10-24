#!/usr/bin/env python3
"""
Setup script for Toyota Finance Chatbot
Creates .env file from template and installs dependencies
"""

import os
import sys
import subprocess
from pathlib import Path

def create_env_file():
    """Create .env file from template if it doesn't exist"""
    env_path = Path(".env")
    template_path = Path("env_template.txt")
    
    if env_path.exists():
        print("✅ .env file already exists")
        return True
    
    if not template_path.exists():
        print("❌ env_template.txt not found")
        return False
    
    # Copy template to .env
    with open(template_path, 'r') as template:
        content = template.read()
    
    with open(env_path, 'w') as env_file:
        env_file.write(content)
    
    print("✅ Created .env file from template")
    print("📝 Please edit .env file with your actual API keys")
    return True

def install_dependencies():
    """Install required dependencies"""
    requirements_file = Path("requirements-chatbot.txt")
    
    if not requirements_file.exists():
        print("❌ requirements-chatbot.txt not found")
        return False
    
    try:
        print("📦 Installing dependencies...")
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ], check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_env_vars():
    """Check if required environment variables are set"""
    from dotenv import load_dotenv
    load_dotenv()
    
    provider = os.getenv("CHATBOT_PROVIDER", "openai")
    print(f"🤖 Chatbot provider: {provider}")
    
    if provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            print("⚠️  OPENAI_API_KEY not set or using placeholder")
            return False
        else:
            print("✅ OPENAI_API_KEY is set")
    
    elif provider == "anthropic":
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key or api_key == "your_anthropic_api_key_here":
            print("⚠️  ANTHROPIC_API_KEY not set or using placeholder")
            return False
        else:
            print("✅ ANTHROPIC_API_KEY is set")
    
    elif provider == "google":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_google_api_key_here":
            print("⚠️  GOOGLE_API_KEY not set or using placeholder")
            return False
        else:
            print("✅ GOOGLE_API_KEY is set")
    
    return True

def test_chatbot():
    """Test the chatbot functionality"""
    try:
        from chatbot import get_chatbot
        
        print("🧪 Testing chatbot...")
        chatbot = get_chatbot()
        
        # Test with a simple message
        response = chatbot.chat("test-user", "Hello, can you help me with Toyota financing?")
        
        if response.get("response"):
            print("✅ Chatbot test successful")
            print(f"📝 Response: {response['response'][:100]}...")
            return True
        else:
            print("❌ Chatbot test failed - no response")
            return False
            
    except Exception as e:
        print(f"❌ Chatbot test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚗 Toyota Finance Chatbot Setup")
    print("=" * 40)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    steps = [
        ("Creating .env file", create_env_file),
        ("Installing dependencies", install_dependencies),
        ("Checking environment variables", check_env_vars),
        ("Testing chatbot", test_chatbot),
    ]
    
    for step_name, step_func in steps:
        print(f"\n{step_name}...")
        if not step_func():
            print(f"❌ Setup failed at: {step_name}")
            print("\n📋 Next steps:")
            print("1. Edit .env file with your API keys")
            print("2. Run: pip install -r requirements-chatbot.txt")
            print("3. Run: python setup_chatbot.py")
            return False
    
    print("\n🎉 Setup completed successfully!")
    print("\n🚀 You can now start the server with:")
    print("   uvicorn main:app --host 0.0.0.0 --port 5000")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
