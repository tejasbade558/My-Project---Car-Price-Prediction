from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from preprocessing import CarDataPreprocessor
from ml_model import CarPricePredictor
import os

app = Flask(__name__)
CORS(app)

# Global variables
preprocessor = None
predictor = None

def load_models():
    """Load pre-trained models and preprocessor"""
    global preprocessor, predictor
    
    try:
        # Load preprocessor
        preprocessor = CarDataPreprocessor()
        preprocessor.load_preprocessor('models/')
        
        # Load predictor
        predictor = CarPricePredictor()
        predictor.set_preprocessor(preprocessor)
        predictor.load_models('models/')
        
        print("Models loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        return False

@app.route('/')
def home():
    return jsonify({
        "message": "Car Price Prediction API",
        "status": "active",
        "endpoints": {
            "/predict": "POST - Predict car price",
            "/health": "GET - API health check"
        }
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "models_loaded": preprocessor is not None and predictor is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.json
        
        # Validate required fields
        required_fields = ['year', 'km_driven', 'fuel', 'seller_type', 
                          'transmission', 'owner', 'engine', 'max_power', 'seats']
        
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing required field: {field}",
                    "required_fields": required_fields
                }), 400
        
        # Add dummy name for preprocessing
        data['name'] = 'Maruti Suzuki'
        
        # Make prediction
        prediction = predictor.predict_price(data, model_name='random_forest')
        
        # Format response
        response = {
            "predicted_price": round(prediction, 2),
            "formatted_price": f"₹{prediction:,.2f}",
            "status": "success",
            "input_data": data
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    try:
        data = request.json
        cars = data.get('cars', [])
        
        if not cars:
            return jsonify({"error": "No cars provided"}), 400
        
        predictions = []
        for car in cars:
            car['name'] = 'Maruti Suzuki'  # Add dummy name
            prediction = predictor.predict_price(car, model_name='random_forest')
            predictions.append({
                "input": car,
                "predicted_price": round(prediction, 2),
                "formatted_price": f"₹{prediction:,.2f}"
            })
        
        return jsonify({
            "predictions": predictions,
            "count": len(predictions),
            "status": "success"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Load models before starting the server
    if load_models():
        print("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load models. Please train models first.")