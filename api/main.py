from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from the frontend
        data = request.json
        year = float(data.get('year', 2020))
        km = float(data.get('kmDriven', 50000))
        brand = data.get('brand', 'Toyota')
        
        # Base prices for different brands (in Rupees)
        brand_map = {
            "BMW": 4500000,
            "Audi": 4200000,
            "Mercedes": 4800000,
            "Toyota": 1800000
        }
        
        # Default to 15L if brand not found
        base_price = brand_map.get(brand, 1500000)
        
        # Calculate Age (Current year is 2026)
        age = 2026 - year
        
        # LOGIC: 
        # 1. Depreciate by 10% of base price for every year of age
        # 2. Depreciate by 2 Rupees for every KM driven
        depreciation = (age * (base_price * 0.1)) + (km * 2)
        
        calculated_price = base_price - depreciation
        
        # SAFETY: Ensure the price doesn't drop below 20% of the original value
        floor_price = base_price * 0.2
        final_price = max(calculated_price, floor_price)
        
        return jsonify({
            'price': float(final_price),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Root route to check if backend is alive
@app.route('/', methods=['GET'])
def home():
    return "Car Price Predictor API is Online!"

if __name__ == "__main__":
    # Get port from environment or default to 10000
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)