from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import random

router = APIRouter()

class PredictInput(BaseModel):
    user_id: str
    current_income: float
    savings: float
    retirement_age_years: Optional[int] = None
    retirement_age_months: Optional[int] = 0
    gender: str
    birth_year: int
    birth_month: int
    total_contributions: Optional[float] = None
    capital: Optional[float] = None
    subaccount: Optional[float] = None
    yearly_contributions: Optional[float] = None

def pension_projection(merged: Dict[str, Any], retirement_age_years: int):
    current_year = datetime.now().year
    years_until_retirement = max((merged["birth_year"] + retirement_age_years) - current_year, 0)

    valorization_rate = 0.045
    projected_capital = sum([
        merged.get("total_contributions", 0),
        merged.get("capital", 0),
        merged.get("subaccount", 0)
    ])
    for _ in range(years_until_retirement):
        projected_capital *= (1 + valorization_rate)
        projected_capital += merged.get("yearly_contributions", 0) * (1 + valorization_rate)

    gender = merged.get("gender", "Kobieta")
    gender_life_expectancy = 82 if gender.lower().startswith("k") else 77
    years_in_retirement = max(gender_life_expectancy - retirement_age_years, 15)

    estimated_monthly_pension = projected_capital / (years_in_retirement * 12) if years_in_retirement else 0
    replacement_rate = (estimated_monthly_pension / merged.get("current_income", 1)) * 100

    estimated_monthly_pension *= random.uniform(0.97, 1.03)
    replacement_rate *= random.uniform(0.97, 1.03)

    return {
        "years_until_retirement": years_until_retirement,
        "projected_capital": round(projected_capital, 2),
        "estimated_monthly_pension": round(estimated_monthly_pension, 2),
        "replacement_rate_percent": round(replacement_rate, 2)
    }

@router.post("/predict")
async def predict(inp: PredictInput):
    merged = inp.dict()
    retirement_age = inp.retirement_age_years or 65
    for key in ["total_contributions", "capital", "subaccount", "yearly_contributions"]:
        if merged.get(key) is None:
            if key == "yearly_contributions":
                merged[key] = inp.current_income * 12 * 0.2
            else:
                merged[key] = getattr(inp, key, 0)
    projection = pension_projection(merged, retirement_age)

    # Simple local heuristic analysis
    rr = projection["replacement_rate_percent"]
    if rr >= 75:
        advice = "Twoja przewidywana stopa zastąpienia jest wysoka — emerytura powinna pokryć większość aktualnego dochodu."
    elif rr >= 50:
        advice = "Stopa zastąpienia jest umiarkowana — rozważ dodatkowe oszczędzanie lub inwestowanie."
    else:
        advice = "Niska stopa zastąpienia — zdecydowanie warto zwiększyć oszczędności lub rozważyć dodatkowe formy zabezpieczenia."

    return {
        "user_id": inp.user_id,
        "gender": inp.gender,
        "birth_year": inp.birth_year,
        "retirement_age_years": retirement_age,
        **projection,
        "llm_analysis": advice
    }
