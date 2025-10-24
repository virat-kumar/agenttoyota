# Toyota Finance Chatbot

A sophisticated chatbot for Toyota Finance that supports multiple LLM providers and provides intelligent responses about vehicle financing, loans, leases, and general Toyota information.

## Features

- 🤖 **Multiple LLM Support**: OpenAI GPT, Anthropic Claude, Google Gemini
- 💬 **Conversation Memory**: Maintains chat history per user
- 🔧 **Configurable**: Environment-based configuration
- 🚀 **REST API**: FastAPI-based endpoints
- 🛡️ **Fallback Responses**: Works even when LLM APIs are unavailable
- 📊 **Status Monitoring**: Health checks and configuration endpoints

## Quick Setup

1. **Create environment file**:
   ```bash
   cd backend
   cp env_template.txt .env
   ```

2. **Edit .env file** with your API keys:
   ```bash
   # Choose your provider
   CHATBOT_PROVIDER=openai  # or anthropic, google
   
   # Add your API key
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements-chatbot.txt
   ```

4. **Run setup script**:
   ```bash
   python setup_chatbot.py
   ```

5. **Start the server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 5000
   ```

## API Endpoints

### Chat
```http
POST /chat
Content-Type: application/json

{
  "user_id": "user123",
  "message": "What Toyota vehicles do you recommend?"
}
```

**Response**:
```json
{
  "response": "I'd be happy to help you find the perfect Toyota vehicle! We offer a wide range of models including sedans like the Camry, SUVs like the RAV4, and hybrids like the Prius. What type of vehicle are you looking for?",
  "user_id": "user123",
  "timestamp": "2024-01-01T12:00:00",
  "provider": "openai",
  "model": "gpt-3.5-turbo"
}
```

### Chat History
```http
GET /chat/history/{user_id}
```

### Clear History
```http
DELETE /chat/history/{user_id}
```

### Status Check
```http
GET /chat/status
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CHATBOT_PROVIDER` | LLM provider (openai/anthropic/google) | openai |
| `CHATBOT_MODEL` | Model name | gpt-3.5-turbo |
| `CHATBOT_TEMPERATURE` | Response creativity (0-1) | 0.7 |
| `CHATBOT_MAX_TOKENS` | Max response length | 1000 |
| `CHATBOT_SYSTEM_PROMPT` | System instructions | Toyota Finance Assistant prompt |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ANTHROPIC_API_KEY` | Anthropic API key | - |
| `GOOGLE_API_KEY` | Google API key | - |

## Supported Providers

### OpenAI
- Models: gpt-3.5-turbo, gpt-4, gpt-4-turbo
- Setup: Get API key from https://platform.openai.com/

### Anthropic Claude
- Models: claude-3-sonnet-20240229, claude-3-haiku-20240307
- Setup: Get API key from https://console.anthropic.com/

### Google Gemini
- Models: gemini-pro, gemini-pro-vision
- Setup: Get API key from https://makersuite.google.com/

## Fallback Mode

If no LLM provider is configured or APIs are unavailable, the chatbot uses intelligent fallback responses based on keywords in the user's message:

- **Financing/Loans**: Information about Toyota financing options
- **Leasing**: Lease vs loan comparisons
- **Hybrid/Electric**: Information about Toyota's hybrid and electric vehicles
- **Pricing**: General pricing information and dealer recommendations
- **Warranty/Service**: Information about ToyotaCare and service options

## Testing

Test the chatbot with the frontend UI or directly via API:

```bash
curl -X POST "http://localhost:5000/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "message": "Hello!"}'
```

## Troubleshooting

1. **"Provider not found"**: Check your `CHATBOT_PROVIDER` setting
2. **"API key not found"**: Verify your API key in the `.env` file
3. **"Import error"**: Install missing packages with `pip install -r requirements-chatbot.txt`
4. **"No response"**: Check API quotas and network connectivity

## Production Considerations

- Use a database for persistent chat history
- Implement rate limiting
- Add authentication/authorization
- Set up monitoring and logging
- Use environment-specific configurations
- Consider caching for frequently asked questions
