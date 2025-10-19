# api/schemas.py
from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field, RootModel, model_validator


# --- Enumerations -------------------------------------------------------------

UserRole = Literal["Human", "AI"]
NavigateKind = Literal[
    "loan page",
    "lease page",
    "lease and loan comparision page",
    "null",  # you allow the *string* "null"
]


# --- Payload Shapes -----------------------------------------------------------

class LoanCore(BaseModel):
    # keep open, you can tighten later
    data: Dict[str, Any]


class LeaseCore(BaseModel):
    data: Any


class CompareLeaseLoan(BaseModel):
    loanCore: LoanCore
    leaseCore: LeaseCore


# --- Core Turn ---------------------------------------------------------------

class Turn(BaseModel):
    user: UserRole = Field(description='Either "Human" or "AI"')
    message: str = Field(min_length=1, description="Message content")

    # allow None or the literal string "null"
    navigate: Optional[NavigateKind] = Field(
        default=None,
        description='One of: "loan page", "lease page", "lease and loan comparision page", "null", or None',
    )

    # IMPORTANT:
    # - allow union of models (Loan/Lease/Compare)
    # - allow a plain {} (Dict[str, Any]) because you said empty object is valid
    # - allow None / omitted
    data: Optional[Union[CompareLeaseLoan, LeaseCore, LoanCore, Dict[str, Any]]] = Field(
        default=None,
        description="Payload for the chosen surface; may be empty {}. Shape depends on `navigate`.",
    )

    @model_validator(mode="after")
    def _normalize_and_guard(self) -> "Turn":
        # normalize "null" -> None
        if self.navigate == "null":
            self.navigate = None

        # Optionally: strip navigate/data for Human turns (lenient)
        if self.user == "Human":
            if self.navigate is not None:
                self.navigate = None
            if self.data not in (None, {}):
                self.data = None

        return self


# --- Request Body (Top-level array) ------------------------------------------

class ChatRequest(RootModel[List[Turn]]):
    """RootModel so the request body is just a JSON array of Turn."""
    @property
    def turns(self) -> List[Turn]:
        return self.root



class LoanChartRequest(BaseModel):
    """Request body for /loan/calcular."""
    vehicle_amount : float = Field(0, ge=0, description="Vechile amount")
    down_payment_cash: float = Field(0, ge=0, description="Cash paid today (defaults to 0)")
    term_months: int = Field(..., gt=0, description="Loan term in months")
    apr_percent: float = Field(..., ge=0, description="APR percentage, e.g., 4.5 for 4.5% APR")
    tax_rate: float = Field(0.0825, ge=0, description="Default Dallas combined tax 8.25% (applied monthly for demo)")

class GetInterest(BaseModel):
    credit_score : float




class LeaseChartRequest(BaseModel):
    """
    Request body for /lease/calcular (no tax).
    vehicle_amount and term_months are required.
    money_factor and acquisition_fee are optional overrides.
    """
    vehicle_amount: float = Field(..., gt=0, description="Vehicle price (cap cost baseline)")
    term_months: int = Field(..., gt=0, description="Lease term in months")
    money_factor: Optional[float] = Field(0.00190, ge=0, description="Lease money factor (MF ~ APR/2400)")
    acquisition_fee: Optional[float] = Field(695.0, ge=0, description="Acquisition fee to roll into cap cost")


# Rebuild models to resolve any postponed annotations when using __future__ annotations
LoanCore.model_rebuild()
LeaseCore.model_rebuild()
CompareLeaseLoan.model_rebuild()
Turn.model_rebuild()
ChatRequest.model_rebuild()
LoanChartRequest.model_rebuild()

__all__ = [
    "UserRole",
    "NavigateKind",
    "LoanCore",
    "LeaseCore",
    "CompareLeaseLoan",
    "Turn",
    "ChatRequest",
    "LoanChartRequest"
]
