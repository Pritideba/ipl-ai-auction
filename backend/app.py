from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

file_path = os.path.join(os.path.dirname(__file__), "players.csv")
players = pd.read_csv(file_path)

@app.route("/")
def home():
    return "IPL Auction Server Running"

@app.route("/players")
def get_players():
    return jsonify(players.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)