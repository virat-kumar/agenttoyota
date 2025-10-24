# 🚗 Toyota Finance Agent

A comprehensive Toyota Finance platform featuring an intelligent chatbot, loan/lease calculators, and modern React UI. Built for Toyota Hackathon with AI-powered customer assistance and financial tools.

![Toyota Finance Agent](https://img.shields.io/badge/Toyota-Finance%20Agent-red?style=for-the-badge&logo=toyota)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?style=for-the-badge&logo=fastapi)
![AI Chatbot](https://img.shields.io/badge/AI-Chatbot-purple?style=for-the-badge&logo=openai)

## 🌟 Features

### 🤖 **Intelligent Chatbot**
- **Multi-LLM Support**: OpenAI GPT, Anthropic Claude, Google Gemini
- **Conversation Memory**: Maintains chat history per user
- **Fallback Responses**: Works even when LLM APIs are unavailable
- **Toyota-Specific Knowledge**: Specialized in Toyota vehicles, financing, and services

### 💰 **Financial Calculators**
- **Loan Calculator**: APR calculations based on credit score
- **Lease Calculator**: Monthly lease payments with tax considerations
- **Credit Score Integration**: Dynamic APR adjustments
- **Interactive Charts**: Visual payment breakdowns

### 🎨 **Modern UI**
- **React + Vite**: Fast development and building
- **Tailwind CSS**: Modern, responsive design
- **TypeScript**: Type-safe development
- **Mobile Responsive**: Works on all devices

### 🔧 **Backend API**
- **FastAPI**: High-performance Python API
- **CORS Enabled**: Cross-origin requests supported
- **RESTful Endpoints**: Clean API design
- **Environment Configuration**: Flexible deployment options

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **Git** (for cloning)

### 1. Clone the Repository
```bash
git clone https://github.com/virat-kumar/agenttoyota.git
cd agenttoyota
```

### 2. Frontend Setup
```bash
cd agenttoyota-ui
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 3. Backend Setup
```bash
cd backend

# Create environment file
cp env_template.txt .env

# Edit .env with your API keys
nano .env

# Install dependencies
pip install -r requirements-chatbot.txt

# Run setup
python setup_chatbot.py

# Start server
uvicorn main:app --host 0.0.0.0 --port 5000
```
Backend will be available at `http://localhost:5000`

## 📁 Project Structure

```
agenttoyota/
├── agenttoyota-ui/          # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # Main application screens
│   │   ├── pages/          # Specific pages (Loan, Lease, Payment)
│   │   └── types.ts       # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
├── backend/                # FastAPI backend
│   ├── main.py            # Main API server
│   ├── chatbot.py         # AI chatbot logic
│   ├── loan_calculator.py # Loan calculations
│   ├── lease_calculator.py # Lease calculations
│   ├── schemas.py         # Pydantic models
│   └── requirements-chatbot.txt
├── README.md              # This file
└── react.sh              # Deployment script
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Chatbot Configuration
CHATBOT_PROVIDER=openai  # or anthropic, google
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_TEMPERATURE=0.7
CHATBOT_MAX_TOKENS=1000

# API Keys (choose your provider)
OPENAI_API_KEY=your_openai_api_key
# ANTHROPIC_API_KEY=your_anthropic_api_key
# GOOGLE_API_KEY=your_google_api_key
```

### Supported LLM Providers

| Provider | Models | Setup |
|----------|--------|-------|
| **OpenAI** | gpt-3.5-turbo, gpt-4 | [Get API Key](https://platform.openai.com/) |
| **Anthropic** | claude-3-sonnet, claude-3-haiku | [Get API Key](https://console.anthropic.com/) |
| **Google** | gemini-pro, gemini-pro-vision | [Get API Key](https://makersuite.google.com/) |

## 📡 API Endpoints

### Chatbot
```http
POST /chat
Content-Type: application/json

{
  "user_id": "user123",
  "message": "What Toyota vehicles do you recommend?"
}
```

### Loan Calculator
```http
POST /loan-chart
Content-Type: application/json

{
  "loan_amount": 25000,
  "credit_score": 750,
  "loan_term_months": 60
}
```

### Lease Calculator
```http
POST /lease-chart
Content-Type: application/json

{
  "msrp": 30000,
  "down_payment": 2000,
  "lease_term_months": 36,
  "money_factor": 0.0015
}
```

### Status Check
```http
GET /chat/status
```

## 🎯 Usage Examples

### Frontend Features
1. **Authentication**: Login/Signup simulation
2. **Profile Form**: Income, credit score, ZIP code input
3. **Recommendations**: AI-powered vehicle suggestions
4. **Chatbot**: Interactive Toyota assistant
5. **Calculators**: Loan and lease payment tools

### Backend Features
1. **Chat History**: Persistent conversation storage
2. **Credit Scoring**: Dynamic APR calculations
3. **Payment Charts**: Visual financial breakdowns
4. **Multi-Provider AI**: Flexible LLM integration

## 🚀 Deployment

### Frontend Deployment
```bash
cd agenttoyota-ui
npm run build
npm run preview
```

### Backend Deployment
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 5000
```

### Production Setup
- Use a reverse proxy (nginx)
- Set up SSL certificates
- Configure environment variables
- Use a production database for chat history

## 🧪 Testing

### Frontend Testing
```bash
cd agenttoyota-ui
npm run dev
# Open http://localhost:5173
```

### Backend Testing
```bash
cd backend
# Test chatbot
curl -X POST "http://localhost:5000/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "message": "Hello!"}'

# Test loan calculator
curl -X POST "http://localhost:5000/loan-chart" \
  -H "Content-Type: application/json" \
  -d '{"loan_amount": 25000, "credit_score": 750, "loan_term_months": 60}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Frontend won't start**
   ```bash
   cd agenttoyota-ui
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Backend API errors**
   - Check `.env` file configuration
   - Verify API keys are valid
   - Ensure all dependencies are installed

3. **Chatbot not responding**
   - Check API key permissions
   - Verify provider configuration
   - Check network connectivity

4. **CORS errors**
   - Backend CORS is configured for all origins
   - Check if backend is running on correct port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Virat Kumar**
- GitHub: [@virat-kumar](https://github.com/virat-kumar)
- Email: virat-kumar@outlook.com
- Company: Celebal Technologies

## 🙏 Acknowledgments

- Toyota for the hackathon opportunity
- OpenAI, Anthropic, and Google for AI APIs
- React and FastAPI communities
- All contributors and testers

---

## 📞 Support

For support, email virat-kumar@outlook.com or create an issue in this repository.

**Built with ❤️ for Toyota Hackathon**