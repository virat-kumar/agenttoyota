"""
Toyota Finance Chatbot Implementation
Supports multiple LLM providers via environment variables
"""

import os
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ToyotaFinanceChatbot:
    """
    Toyota Finance Chatbot that supports multiple LLM providers
    """
    
    def __init__(self):
        # Load environment variables from .env file
        try:
            from dotenv import load_dotenv
            load_dotenv()
        except ImportError:
            pass  # dotenv not available, use system env vars
        
        self.provider = os.getenv("CHATBOT_PROVIDER", "openai").lower()
        self.model = os.getenv("CHATBOT_MODEL", "gpt-3.5-turbo")
        self.temperature = float(os.getenv("CHATBOT_TEMPERATURE", "0.7"))
        self.max_tokens = int(os.getenv("CHATBOT_MAX_TOKENS", "1000"))
        self.system_prompt = os.getenv(
            "CHATBOT_SYSTEM_PROMPT", 
            """You are a Toyota Finance Assistant focused on selling loans and leases. Your main goal is to help customers get financing for Toyota vehicles and direct them to interactive dashboards.

AVAILABLE TOYOTA VEHICLES:
- **2025 Toyota Camry (Hybrid)** - XV80 model - [Learn more](https://www.toyota.com/camry/)
- **Toyota Prius (Hybrid)** - XW60 model - [Learn more](https://www.toyota.com/prius/)
- **Toyota Corolla Cross (Gasoline)** - XG10 model - [Learn more](https://www.toyota.com/corollacross/)

DASHBOARD INTEGRATION:
You can direct users to interactive loan and lease dashboards using these URLs:

LOAN DASHBOARD: http://machine-virat.eastus2.cloudapp.azure.com/loan-quote?vehicle_amount={amount}&down_payment_cash={down_payment}&term_months={term}&apr_percent={apr}&tax_rate=0.0825&vehicle_name={vehicle_name}

LEASE DASHBOARD: http://machine-virat.eastus2.cloudapp.azure.com/lease-quote?vehicle_amount={amount}&term_months={term}&vehicle_name={vehicle_name}

REQUIRED PARAMETERS:
- vehicle_amount: Vehicle price in USD
- down_payment_cash: Cash down payment (0 if none)
- term_months: Loan/lease term (24, 36, 48, 60 months)
- apr_percent: Interest rate percentage (3.9, 4.5, 5.2, etc.)
- tax_rate: Always use 0.0825 (Dallas tax rate)
- vehicle_name: Full vehicle name (e.g., "2025 Toyota Camry")

IMPORTANT: All parameters must be provided for URLs to work. If any parameter is missing, ask the user for it before providing the dashboard link.

YOUR ROLE:
1. Help customers choose the right Toyota vehicle
2. Gather financing information (amount, down payment, term, APR)
3. Direct them to loan or lease dashboards with complete URLs
4. Focus on selling loans and leases
5. Mention that dashboards have payment gateways for easy completion

FORMATTING GUIDELINES:
- Use rich markdown formatting for better presentation
- Use **bold** for emphasis and important information
- Use bullet points (-) and numbered lists (1., 2., 3.)
- Create clickable links with [link text](url) format
- Use ## for section headers when appropriate
- Use > for callout boxes or important notes
- Format URLs as clickable links for dashboards

Be friendly, professional, and sales-focused. Always try to get users to the interactive dashboards for quotes."""
        )
        
        # Initialize the appropriate LLM client
        self.client = self._initialize_client()
        
        # Chat history storage (in production, use a database)
        self.chat_history: Dict[str, List[Dict[str, Any]]] = {}
    
    def _initialize_client(self):
        """Initialize the appropriate LLM client based on provider"""
        try:
            if self.provider == "openai":
                return self._init_openai()
            elif self.provider == "azure":
                return self._init_azure_openai()
            elif self.provider == "anthropic":
                return self._init_anthropic()
            elif self.provider == "google":
                return self._init_google()
            else:
                logger.warning(f"Unknown provider: {self.provider}, falling back to mock")
                return self._init_mock()
        except Exception as e:
            logger.error(f"Failed to initialize {self.provider} client: {e}")
            logger.info("Falling back to mock client")
            return self._init_mock()
    
    def _init_openai(self):
        """Initialize OpenAI client"""
        try:
            from openai import OpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment")
            
            client = OpenAI(api_key=api_key)
            return client
        except ImportError:
            raise ImportError("OpenAI package not installed. Run: pip install openai")
    
    def _init_azure_openai(self):
        """Initialize Azure OpenAI client"""
        try:
            from openai import AzureOpenAI
            api_key = os.getenv("AZURE_OPENAI_API_KEY")
            endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
            deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
            api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
            
            if not api_key:
                raise ValueError("AZURE_OPENAI_API_KEY not found in environment")
            if not endpoint:
                raise ValueError("AZURE_OPENAI_ENDPOINT not found in environment")
            if not deployment:
                raise ValueError("AZURE_OPENAI_DEPLOYMENT not found in environment")
            
            # Create Azure OpenAI client
            client = AzureOpenAI(
                api_key=api_key,
                api_version=api_version,
                azure_endpoint=endpoint
            )
            
            # Store deployment name for use in API calls
            self.deployment_name = deployment
            
            return client
        except ImportError:
            raise ImportError("OpenAI package not installed. Run: pip install openai")
    
    def _init_anthropic(self):
        """Initialize Anthropic client"""
        try:
            import anthropic
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY not found in environment")
            
            return anthropic.Anthropic(api_key=api_key)
        except ImportError:
            raise ImportError("Anthropic package not installed. Run: pip install anthropic")
    
    def _init_google(self):
        """Initialize Google Gemini client"""
        try:
            import google.generativeai as genai
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment")
            
            genai.configure(api_key=api_key)
            return genai
        except ImportError:
            raise ImportError("Google Generative AI package not installed. Run: pip install google-generativeai")
    
    def _init_mock(self):
        """Initialize mock client for testing"""
        return MockLLMClient()
    
    def chat(self, user_id: str, message: str) -> Dict[str, Any]:
        """
        Process a chat message and return a response
        
        Args:
            user_id: Unique identifier for the user
            message: User's message
            
        Returns:
            Dict containing the response and metadata
        """
        try:
            # Get or create chat history for this user
            if user_id not in self.chat_history:
                self.chat_history[user_id] = []
            
            # Add user message to history
            self.chat_history[user_id].append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Generate response
            response = self._generate_response(user_id, message)
            
            # Add assistant response to history
            self.chat_history[user_id].append({
                "role": "assistant",
                "content": response,
                "timestamp": datetime.now().isoformat()
            })
            
            # Keep only last 20 messages to prevent context overflow
            if len(self.chat_history[user_id]) > 20:
                self.chat_history[user_id] = self.chat_history[user_id][-20:]
            
            return {
                "response": response,
                "user_id": user_id,
                "timestamp": datetime.now().isoformat(),
                "provider": self.provider,
                "model": self.model
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return {
                "response": "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our support team.",
                "user_id": user_id,
                "timestamp": datetime.now().isoformat(),
                "error": str(e),
                "provider": self.provider
            }
    
    def _generate_response(self, user_id: str, message: str) -> str:
        """Generate response using the configured LLM provider"""
        
        if self.provider == "openai":
            return self._generate_openai_response(user_id, message)
        elif self.provider == "azure":
            return self._generate_azure_openai_response(user_id, message)
        elif self.provider == "anthropic":
            return self._generate_anthropic_response(user_id, message)
        elif self.provider == "google":
            return self._generate_google_response(user_id, message)
        else:
            return self._generate_mock_response(user_id, message)
    
    def _generate_openai_response(self, user_id: str, message: str) -> str:
        """Generate response using OpenAI"""
        try:
            # Prepare messages for OpenAI
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add recent chat history
            recent_history = self.chat_history[user_id][-10:]  # Last 10 messages
            for msg in recent_history:
                if msg["role"] in ["user", "assistant"]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._get_fallback_response(message)
    
    def _generate_azure_openai_response(self, user_id: str, message: str) -> str:
        """Generate response using Azure OpenAI"""
        try:
            # Prepare messages for Azure OpenAI
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add recent chat history
            recent_history = self.chat_history[user_id][-10:]  # Last 10 messages
            for msg in recent_history:
                if msg["role"] in ["user", "assistant"]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            response = self.client.chat.completions.create(
                model=self.deployment_name,  # Use deployment name for Azure
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Azure OpenAI API error: {e}")
            return self._get_fallback_response(message)
    
    def _generate_anthropic_response(self, user_id: str, message: str) -> str:
        """Generate response using Anthropic Claude"""
        try:
            # Prepare messages for Claude
            messages = []
            
            # Add recent chat history
            recent_history = self.chat_history[user_id][-10:]  # Last 10 messages
            for msg in recent_history:
                if msg["role"] in ["user", "assistant"]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=self.system_prompt,
                messages=messages
            )
            
            return response.content[0].text.strip()
            
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            return self._get_fallback_response(message)
    
    def _generate_google_response(self, user_id: str, message: str) -> str:
        """Generate response using Google Gemini"""
        try:
            model = self.client.GenerativeModel(self.model)
            
            # Prepare context with system prompt and recent history
            context = f"{self.system_prompt}\n\n"
            
            # Add recent chat history
            recent_history = self.chat_history[user_id][-10:]  # Last 10 messages
            for msg in recent_history:
                if msg["role"] == "user":
                    context += f"User: {msg['content']}\n"
                elif msg["role"] == "assistant":
                    context += f"Assistant: {msg['content']}\n"
            
            # Add current message
            context += f"User: {message}\nAssistant:"
            
            response = model.generate_content(
                context,
                generation_config={
                    "temperature": self.temperature,
                    "max_output_tokens": self.max_tokens,
                }
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Google API error: {e}")
            return self._get_fallback_response(message)
    
    def _generate_mock_response(self, user_id: str, message: str) -> str:
        """Generate mock response for testing"""
        return self._get_fallback_response(message)
    
    def _get_fallback_response(self, message: str) -> str:
        """Provide fallback responses when LLM is unavailable"""
        message_lower = message.lower()
        
        # Greeting responses
        if any(word in message_lower for word in ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]):
            return "Hello! I'm your Toyota Finance Assistant. I can help you explore vehicles, compare financing options, and answer questions about loans and leases. What would you like to know about Toyota vehicles or financing?"
        
        # Identity questions
        elif any(word in message_lower for word in ["who are you", "what are you", "introduce yourself"]):
            return "I'm your Toyota Finance Assistant! I'm here to help you with everything related to Toyota vehicles and financing. I can assist with vehicle recommendations, loan options, lease comparisons, and answer questions about Toyota's lineup. How can I help you today?"
        
        # Vehicle recommendations
        elif any(word in message_lower for word in ["recommend", "suggest", "best", "good", "vehicle", "car", "toyota"]):
            return "I'd be happy to recommend Toyota vehicles! We have excellent options for every need: the Camry for reliability, RAV4 for adventure, Prius for efficiency, and Tacoma for work. What type of vehicle are you looking for? (sedan, SUV, truck, hybrid, etc.)"
        
        # Financing questions
        elif any(word in message_lower for word in ["loan", "financing", "finance", "payment", "monthly"]):
            return "Toyota offers competitive financing options! We have special rates, flexible terms, and programs for various credit situations. You can use our loan calculator to estimate payments, or I can help you understand the difference between loans and leases. What's your budget range?"
        
        # Lease questions
        elif any(word in message_lower for word in ["lease", "leasing", "rent"]):
            return "Toyota leasing is a great option! You get lower monthly payments, the latest technology, and flexible terms. Our lease programs often include maintenance and warranty coverage. Would you like to compare lease vs loan options for your situation?"
        
        # Hybrid/Electric questions
        elif any(word in message_lower for word in ["hybrid", "electric", "ev", "prius", "fuel", "efficient", "mpg"]):
            return "Toyota leads in hybrid technology! We offer the Prius, Camry Hybrid, RAV4 Hybrid, and more. These vehicles provide excellent fuel efficiency and environmental benefits. The Prius gets up to 58 MPG combined! Would you like information about specific hybrid models?"
        
        # Pricing questions
        elif any(word in message_lower for word in ["price", "cost", "expensive", "cheap", "affordable", "budget"]):
            return "Toyota offers vehicles at various price points! The Corolla starts around $22,000, Camry around $26,000, and RAV4 around $28,000. We also have special offers and incentives. What's your budget range? I can recommend the best options for you."
        
        # Warranty/Service questions
        elif any(word in message_lower for word in ["warranty", "maintenance", "service", "repair", "reliable"]):
            return "Toyota vehicles come with comprehensive warranties! We offer 3-year/36,000-mile basic warranty, 5-year/60,000-mile powertrain warranty, and ToyotaCare maintenance plans. Toyota is known for reliability and low maintenance costs. Would you like specific warranty details?"
        
        # Default response
        else:
            return "I'm here to help with Toyota vehicles and financing! I can assist with vehicle recommendations, loan options, lease comparisons, pricing information, and more. What specific information would you like about Toyota vehicles or financing options?"
    
    def get_chat_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get chat history for a user"""
        return self.chat_history.get(user_id, [])
    
    def clear_chat_history(self, user_id: str) -> bool:
        """Clear chat history for a user"""
        if user_id in self.chat_history:
            del self.chat_history[user_id]
            return True
        return False


class MockLLMClient:
    """Mock LLM client for testing when no real API is available"""
    
    def __init__(self):
        self.responses = [
            "I'm a mock Toyota Finance Assistant. How can I help you today?",
            "That's a great question about Toyota financing! Let me help you with that.",
            "Toyota offers excellent financing options. Would you like to learn more?",
            "I'd be happy to assist you with Toyota vehicle information and financing.",
        ]
        self.response_index = 0
    
    @property
    def chat(self):
        """Mock chat property for new OpenAI API compatibility"""
        return self
    
    @property
    def completions(self):
        """Mock completions property"""
        return self
    
    def create(self, **kwargs):
        """Mock create method for new OpenAI API format"""
        class MockChoice:
            def __init__(self, content):
                self.message = MockMessage(content)
        
        class MockMessage:
            def __init__(self, content):
                self.content = content
        
        # Get the user's message from kwargs
        messages = kwargs.get('messages', [])
        user_message = ""
        if messages:
            for msg in messages:
                if msg.get('role') == 'user':
                    user_message = msg.get('content', '')
                    break
        
        # Use intelligent fallback response based on message content
        if user_message:
            # Import the fallback response function
            from chatbot import ToyotaFinanceChatbot
            temp_bot = ToyotaFinanceChatbot()
            response = temp_bot._get_fallback_response(user_message)
        else:
            response = self.responses[self.response_index % len(self.responses)]
            self.response_index += 1
        
        class MockResponse:
            def __init__(self, content):
                self.choices = [MockChoice(content)]
        
        return MockResponse(response)
    
    def ChatCompletion(self):
        """Mock ChatCompletion for old OpenAI API compatibility"""
        return self
    
    def get_response(self, message: str) -> str:
        """Get a mock response"""
        response = self.responses[self.response_index % len(self.responses)]
        self.response_index += 1
        return response


# Global chatbot instance - will be created fresh each time
chatbot = None


def get_chatbot() -> ToyotaFinanceChatbot:
    """Get the global chatbot instance, creating a new one if needed"""
    global chatbot
    if chatbot is None:
        chatbot = ToyotaFinanceChatbot()
    return chatbot
