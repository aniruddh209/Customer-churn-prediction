import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained pipelines
models_dict = {}
default_model = None

try:
    if os.path.exists("all_models.pkl"):
        models_dict = joblib.load("all_models.pkl")
    if os.path.exists("customer_churn_model.pkl"):
        default_model = joblib.load("customer_churn_model.pkl")
except Exception as e:
    print(f"Error loading model files: {e}")

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "message": "Customer Churn Prediction Multi-Model API is running",
        "available_models": list(models_dict.keys()) if models_dict else ["Logistic Regression"]
    })

@app.route("/models", methods=["GET"])
def get_models():
    return jsonify({
        "models": list(models_dict.keys()) if models_dict else ["Logistic Regression"]
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        model_name = data.get("model_name", "Logistic Regression") if isinstance(data, dict) else "Logistic Regression"
        
        # Remove model_name metadata from customer data dictionary
        customer_data = {k: v for k, v in data.items() if k != "model_name"}
        
        # Convert incoming JSON to DataFrame
        customer = pd.DataFrame([customer_data])
        
        # Ensure correct numeric dtypes
        num_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 'SeniorCitizen']
        for col in num_cols:
            if col in customer.columns:
                customer[col] = pd.to_numeric(customer[col], errors='coerce').fillna(0)

        # Select model pipeline
        selected_model = models_dict.get(model_name, default_model)
        if selected_model is None and default_model is not None:
            selected_model = default_model
            
        if selected_model is None:
            return jsonify({"error": "No model loaded on server"}), 500

        # Prediction
        prediction = selected_model.predict(customer)[0]

        # Probability of churn
        probability = selected_model.predict_proba(customer)[0][1]

        # Risk level classification
        if probability >= 0.65:
            risk = "High"
        elif probability >= 0.35:
            risk = "Medium"
        else:
            risk = "Low"

        result = {
            "prediction": int(prediction),
            "churn": "Yes" if prediction == 1 else "No",
            "probability": round(float(probability) * 100, 2),
            "risk": risk,
            "used_model": model_name
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )