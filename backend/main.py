from __future__ import annotations

from fastapi import FastAPI
from typing import Any, Dict

from schemas import ChatRequest, Turn


app = FastAPI(title="Toyota Hackathon Backend")



@app.post("/chat", response_model=ChatRequest)
def chat(payload: ChatRequest) -> ChatRequest:
    """
    Accepts an array of chat turns (Human/AI) and returns the same structure back.
    """
    last: Turn = payload.turns[-1] if payload.turns else Turn(user="AI", message="(empty)")

    # Example modification to illustrate the return type still matches ChatRequest
    response_turns = payload.turns + [
        Turn(user="AI", message=f"Echoing your last message: {last.message}")
    ]

    # Return a ChatRequest instance — FastAPI will auto-convert to JSON
    return ChatRequest(__root__=response_turns)