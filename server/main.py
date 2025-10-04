from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from get_data import load_inflation, load_demographics

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Завантаження даних
inflation_data = load_inflation("Poland")
demographics = load_demographics("2025")

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/forecast", response_class=HTMLResponse)
def forecast(request: Request,
             income: float = Form(...),
             expenses: float = Form(...),
             years: int = Form(...)):

    results = []
    total_savings = 0
    current_income = income
    current_expenses = expenses
    current_year = 2025

    for i in range(years):
        year = current_year + i
        inflation_rate = inflation_data.get(year, list(inflation_data.values())[-1])
        demo_factor = demographics.get(year, list(demographics.values())[-1]) / 100

        # Оновлюємо витрати та доходи
        current_expenses = 1 + inflation_rate / 100
        current_income = current_income * (1 + demo_factor)
        net_savings = current_income - current_expenses
        total_savings += net_savings

        results.append({
            "year": year,
            "expenses": round(current_expenses, 2),
            "savings": round(net_savings, 2),
            "total_savings": round(total_savings, 2)
        })

    return templates.TemplateResponse("index.html", {
        "request": request,
        "results": results,
        "expenses": expenses,
        "years": years
    })
