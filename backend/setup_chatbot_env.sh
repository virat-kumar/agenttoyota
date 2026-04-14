#!/bin/bash

# Toyota Finance Chatbot Setup Script
# This script helps you configure the chatbot with your Azure OpenAI credentials

echo "🚗 Toyota Finance Chatbot Setup"
echo "================================"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Creating one..."
    cp env_template.txt .env
fi

echo ""
echo "📝 Current .env configuration:"
echo "-------------------------------"
grep -E "(CHATBOT_PROVIDER|AZURE_OPENAI)" .env

echo ""
echo "🔧 To fix the chatbot connection, you need to:"
echo ""
echo "1. Edit the .env file with your actual Azure OpenAI credentials:"
echo "   nano .env"
echo ""
echo "2. Update these values:"
echo "   AZURE_OPENAI_API_KEY=your_actual_api_key"
echo "   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/"
echo "   AZURE_OPENAI_DEPLOYMENT=your_deployment_name"
echo "   CHATBOT_PROVIDER=azure"
echo ""
echo "3. Restart the server:"
echo "   uvicorn main:app --host 0.0.0.0 --port 5000"
echo ""

# Test current configuration
echo "🧪 Testing current chatbot configuration..."
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()

provider = os.getenv('CHATBOT_PROVIDER', 'openai')
azure_key = os.getenv('AZURE_OPENAI_API_KEY', '')
azure_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT', '')
azure_deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT', '')

print(f'Provider: {provider}')
print(f'Azure Key: {\"✅ Set\" if azure_key and azure_key != \"your_actual_azure_api_key_here\" else \"❌ Not set or placeholder\"}')
print(f'Azure Endpoint: {\"✅ Set\" if azure_endpoint and azure_endpoint != \"https://your-resource.openai.azure.com/\" else \"❌ Not set or placeholder\"}')
print(f'Azure Deployment: {\"✅ Set\" if azure_deployment and azure_deployment != \"your_deployment_name\" else \"❌ Not set or placeholder\"}')

if provider == 'azure' and azure_key and azure_endpoint and azure_deployment:
    if 'your_' in azure_key or 'your_' in azure_endpoint or 'your_' in azure_deployment:
        print('\\n⚠️  Configuration has placeholder values. Please update with real credentials.')
    else:
        print('\\n✅ Configuration looks good!')
else:
    print('\\n❌ Configuration incomplete. Please update .env file.')
"

echo ""
echo "💡 If you don't have Azure OpenAI credentials, you can:"
echo "   1. Use OpenAI directly (set OPENAI_API_KEY)"
echo "   2. Use the mock mode for testing (set CHATBOT_PROVIDER=mock)"
echo ""
