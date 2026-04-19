import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

# load dataset
data = pd.read_csv("players.csv")

# encode categorical features
le_role = LabelEncoder()
le_type = LabelEncoder()

data["role"] = le_role.fit_transform(data["role"])
data["type"] = le_type.fit_transform(data["type"])

# features
X = data[["role","type","rating","base_price"]]

# target
y = data["final_price"]

# train model
model = RandomForestRegressor()
model.fit(X,y)

# save model
joblib.dump(model,"price_model.pkl")

print("Model trained and saved")