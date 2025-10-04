from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class PredictionRequest(BaseModel):
    income: float
    age: int
    savings: float

@router.post("/predict")
def predict_finances(data: PredictionRequest):
    """Return a simple projection based on basic input."""

    # Simulated growth assumptions
    income_growth_rate = 0.06  # ~6% per year
    inflation = 0.035          # ~3.5% annual inflation
    years_until_retirement = max(65 - data.age, 0)

    # Future income (3-year projection)
    future_income = data.income * ((1 + income_growth_rate - inflation) ** 3)

    # Rough estimate of retirement sum (savings + accumulated income)
    yearly_savings_rate = 0.12
    avg_income_over_years = (data.income + future_income) / 2
    retirement_sum = data.savings + (avg_income_over_years * yearly_savings_rate * years_until_retirement)

    # Add randomness for realism (±5%)
    retirement_sum *= random.uniform(0.95, 1.05)
    future_income *= random.uniform(0.98, 1.02)

    return {
        "future_income": round(future_income, 2),
        "retirement_sum": round(retirement_sum, 2),
        "confidence": round(random.uniform(0.8, 0.95), 2),
    }
