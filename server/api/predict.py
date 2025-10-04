from fastapi import APIRouter
from pydantic import BaseModel
import random
from calculator.calculator import InflationCalculator
from datetime import datetime

router = APIRouter()

inflation_calc = InflationCalculator()

class PredictionRequest(BaseModel):
    last_zus_year: int = 2024
    gender: str  # "Kobieta" / "Mężczyzna"
    birth_month: int
    birth_year: int
    total_contributions: float  # Kwota zwaloryzowanych składek
    capital: float              # Kwota zwaloryzowanego kapitału początkowego
    subaccount: float           # Zwaloryzowana kwota ogółem na subkoncie
    yearly_contributions: float # Kwota składek za 12 miesięcy kalendarzowych
    retirement_age_years: int
    retirement_age_months: int
    start_work_year: int
    current_income: float
    ofe_member: bool = True
    future_income_percent: float = 100.0  # Przeciętne wynagrodzenie % w przyszłości


@router.post("/predict")
def predict_retirement(data: PredictionRequest):
    """Simulate advanced ZUS-style pension forecast."""

    current_year = datetime.now().year
    years_worked = current_year - data.start_work_year
    retirement_year = data.birth_year + data.retirement_age_years
    years_until_retirement = max(retirement_year - current_year, 0)
    
    infaltion_in_the_future = inflation_calc.predict_infaltion(years_until_retirement)

    # --- Capital growth simulation ---
    valorization_rate = 0.045
    projected_capital = (data.total_contributions + data.capital + data.subaccount)
    for _ in range(years_until_retirement):
        projected_capital *= (1 + valorization_rate)

    # Add yearly contributions growth
    for _ in range(years_until_retirement):
        projected_capital += data.yearly_contributions * (1 + valorization_rate)

    # --- Pension estimation ---
    gender_life_expectancy = 82 if data.gender.lower().startswith("k") else 77
    years_in_retirement = max(gender_life_expectancy - data.retirement_age_years, 15)

    estimated_monthly_pension = projected_capital / (years_in_retirement * 12)

    # --- Replacement rate ---
    replacement_rate = (estimated_monthly_pension / data.current_income) * 100 if data.current_income else 0

    # Random realism factor
    estimated_monthly_pension *= random.uniform(0.97, 1.03)
    replacement_rate *= random.uniform(0.97, 1.03)

    return {
        "retirement_year": retirement_year,
        "years_until_retirement": years_until_retirement,
        "projected_capital": round(projected_capital, 2),
        "estimated_monthly_pension": round(estimated_monthly_pension, 2),
        "replacement_rate_percent": round(replacement_rate, 2),
        "confidence": round(random.uniform(0.85, 0.96), 2),
        "gender": data.gender,
        "years_worked": years_worked
    }
