# api/schemas.py
from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional
from pydantic import RootModel,BaseModel, Field, model_validator


# --- Enumerations -------------------------------------------------------------

UserRole = Literal["Human", "AI"]
NavigateKind = Literal[
    "loan page",
    "lease page",
    "lease and loan comparision page",
    "null",     # you said the string "null" is allowed
]


class LoanCore(BaseModel):
    data : Dict


class LeaseCore(BaseModel):
    data : Any



class CompareLeaseLoan(BaseModel):
    loanCore: LoanCore
    leaseCore: LeaseCore 




# --- Core message turn --------------------------------------------------------

class Turn(BaseModel):
    user: UserRole = Field(description='Either "Human" or "AI"')
    message: str = Field(min_length=1, description="Message content")

    navigate: Optional[NavigateKind] = Field(
        default=None,
        description='One of: "loan page", "lease page", "lease and loan comparision page", "null", or None',
    )

    data: Optional[Union[LoanCore,LeaseCore, CompareLeaseLoan ]] = Field(
        default=None,
        description="Free-form JSON payload; may be empty {}. Schema depends on `navigate`.",
    )




class ChatRequest(RootModel[List[Turn]]):
    """RootModel so the request body is just a JSON array of Turn."""
    @property
    def turns(self) -> List[Turn]:
        return self.root
