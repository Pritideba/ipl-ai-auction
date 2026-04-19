import joblib
import pandas as pd

model = joblib.load("price_model.pkl")

def predict_price(player):

    role_map = {
        "Batter":0,
        "Bowler":1,
        "Allrounder":2
    }

    type_map = {
        "Capped":0,
        "Uncapped":1
    }

    X = [[
        role_map[player["role"]],
        type_map[player["type"]],
        player["rating"],
        player["base_price"]
    ]]

    price = model.predict(X)

    return round(price[0],2)