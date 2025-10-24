# main.py
from __future__ import annotations

from typing import Any, Dict
from fastapi.middleware.cors import CORSMiddleware  # <-- add this import


from fastapi import FastAPI, HTTPException
from schemas import ChatRequest, Turn, LoanChartRequest, GetInterest, LeaseChartRequest
from loan_calculator import build_loan_chartjs_data
from credit_score_calculator import apr_percent_from_credit_score
from lease_calculator import build_lease_chartjs_data_no_tax
from chatbot import get_chatbot

app = FastAPI(title="Toyota Hackathon Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow all origins
    allow_methods=["*"],          # GET, POST, PUT, DELETE, OPTIONS, ...
    allow_headers=["*"],          # Authorization, Content-Type, etc.
    allow_credentials=False,      # must be False when using "*" for origins
    # expose_headers can be set if you need browsers to read custom headers:
    # expose_headers=["Content-Disposition"]
)


@app.post("/chat")
def chat(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Toyota Finance Chatbot endpoint
    
    Expected request format:
    {
        "user_id": "string",
        "message": "string"
    }
    
    Returns:
    {
        "response": "string",
        "user_id": "string", 
        "timestamp": "string",
        "provider": "string",
        "model": "string"
    }
    """
    try:
        user_id = request.get("user_id", "anonymous")
        message = request.get("message", "")
        
        if not message.strip():
            return {
                "response": "Please provide a message to chat with me!",
                "user_id": user_id,
                "timestamp": "2024-01-01T00:00:00",
                "provider": "error",
                "model": "none"
            }
        
        # Get chatbot instance and process message
        chatbot = get_chatbot()
        response = chatbot.chat(user_id, message)
        
        return response
        
    except Exception as e:
        return {
            "response": f"I'm sorry, I encountered an error: {str(e)}",
            "user_id": request.get("user_id", "anonymous"),
            "timestamp": "2024-01-01T00:00:00",
            "provider": "error",
            "model": "none",
            "error": str(e)
        }

@app.post("/lease/calculator")
def lease_calcular(body: LeaseChartRequest) -> Dict[str, Any]:
    """
    Build Chart.js-ready lease breakdown WITHOUT tax.
    """
    try:
        return build_lease_chartjs_data_no_tax(
            vehicle_amount=body.vehicle_amount,
            term_months=body.term_months,
            money_factor=body.money_factor,
            acquisition_fee=body.acquisition_fee,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@app.post("/loan/Calculator")
def loan_calcular(body: LoanChartRequest) -> Dict[str, Any]:
    """
    Build Chart.js-ready loan breakdown data.

    Inputs (JSON body):
      - down_payment_cash (float, default 0)
      - term_months      (int, required)
      - apr_percent      (float, required)
      - tax_rate         (float, default 0.0825 for Dallas)

    Returns:
      Dict[str, Any] matching build_loan_chartjs_data output:
        { meta, chartjs, timeseries, totals, schedule }
    """
    try:
        return build_loan_chartjs_data(
            vehicle_amount = body.vehicle_amount,
            down_payment_cash=body.down_payment_cash,
            term_months=body.term_months,
            apr_percent=body.apr_percent,
            tax_rate=body.tax_rate,
        )
    except Exception as exc:
        # Surface validation/logic errors as 400s for the client
        raise HTTPException(status_code=400, detail=str(exc))



@app.post("/getInterest")
def getInterest(body: GetInterest):
    return {
        "score" : apr_percent_from_credit_score(body.credit_score)
    }

@app.get("/chat/history/{user_id}")
def get_chat_history(user_id: str) -> Dict[str, Any]:
    """Get chat history for a user"""
    try:
        chatbot = get_chatbot()
        history = chatbot.get_chat_history(user_id)
        return {
            "user_id": user_id,
            "history": history,
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/chat/history/{user_id}")
def clear_chat_history(user_id: str) -> Dict[str, Any]:
    """Clear chat history for a user"""
    try:
        chatbot = get_chatbot()
        success = chatbot.clear_chat_history(user_id)
        return {
            "user_id": user_id,
            "cleared": success,
            "message": "Chat history cleared" if success else "No history found"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/status")
def chat_status() -> Dict[str, Any]:
    """Get chatbot status and configuration"""
    try:
        chatbot = get_chatbot()
        return {
            "provider": chatbot.provider,
            "model": chatbot.model,
            "temperature": chatbot.temperature,
            "max_tokens": chatbot.max_tokens,
            "active_users": len(chatbot.chat_history),
            "status": "active"
        }
    except Exception as e:
        return {
            "provider": "unknown",
            "model": "unknown", 
            "status": "error",
            "error": str(e)
        }