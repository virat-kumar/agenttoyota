# main.py
from __future__ import annotations

from typing import Any, Dict
from fastapi.middleware.cors import CORSMiddleware  # <-- add this import


from fastapi import FastAPI, HTTPException
from schemas import ChatRequest, Turn, LoanChartRequest, GetInterest, LeaseChartRequest
from loan_calculator import build_loan_chartjs_data
from credit_score_calculator import apr_percent_from_credit_score
from lease_calculator import build_lease_chartjs_data_no_tax

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


@app.post("/chat", response_model=ChatRequest)
def chat(payload: ChatRequest) -> ChatRequest:
    """
    Accepts an array of chat turns and returns the same structure back, with
    a simple AI echo appended so you can see end-to-end validation & response.
    """
    last: Turn = payload.turns[-1] if payload.turns else Turn(user="AI", message="(empty)")

    response_turns = [
        *payload.turns,
        Turn(user="AI", message=f"Echoing your last message: {last.message}")
    ]

    # RootModel[List[Turn]]: return using `root=...` in Pydantic v2
    return ChatRequest(root=response_turns)

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