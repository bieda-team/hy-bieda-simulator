import pandas as pd

def load_inflation(country):
    df = pd.read_csv("../../../Biohacking_Hackyear2025/dane/inflation.csv")
    df = df[df["country_name"] == country]
    return dict(zip(df["Year"], df["Inflation"]))

def load_demographics(year):
    df = pd.read_csv("../../../Biohacking_Hackyear2025/dane/Demographic_Dynamics.csv")
    df = df[df["year"] == year]
    return dict(zip(df["Year"], df["Demographic"]))

# def load_cost_of_living(country):
#     df = pd.read_csv("data/cost_of_living.csv")
#     df = df[df["Country"] == country]
#     return dict(zip(df["Year"], df["Cost"]))
