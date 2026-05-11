from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Inputs from Frontend
        brand = data.get('brand', 'Toyota')
        model_type = data.get('modelType', 'Sedan') # e.g., SUV, Sedan, Hatchback
        year = float(data.get('year', 2020))
        km = float(data.get('kmDriven', 50000))
        fuel = data.get('fuelType', 'Petrol')
        condition = data.get('condition', 'Good') # Excellent, Good, Fair, Damaged
        
        # 1. Base Price by Brand & Body Type
        brand_map = {"BMW": 4500000, "Audi": 4200000, "Mercedes": 4800000, "Toyota": 1800000, "Honda": 1500000}
        type_multiplier = {"SUV": 1.3, "Sedan": 1.0, "Hatchback": 0.8, "Luxury": 1.5}
        
        base_price = brand_map.get(brand, 1200000) * type_multiplier.get(model_type, 1.0)
        
        # 2. Fuel Type Premium
        fuel_map = {"Diesel": 1.15, "Petrol": 1.0, "CNG": 0.9, "Electric": 1.25}
        base_price *= fuel_map.get(fuel, 1.0)
        
        # 3. Depreciation (Age + Mileage)
        age = 2026 - year
        # Age drops value by 7% per year, KM drops it by 1.5 per km
        depreciation = (age * (base_price * 0.07)) + (km * 1.5)
        current_val = base_price - depreciation
        
        # 4. Damage / Condition Impact (The "Missing" Piece)
        condition_map = {
            "Excellent": 1.05,  # 5% Bonus
            "Good": 1.0,       # Standard
            "Fair": 0.80,      # 20% Penalty
            "Damaged": 0.40    # 60% Penalty (Major accident/repairs needed)
        }
        final_price = current_val * condition_map.get(condition, 1.0)
        
        # 5. Safety Floor (A car never costs 0)
        final_price = max(final_price, base_price * 0.12)
        
        return jsonify({
            'price': round(float(final_price), 2),
            'brand': brand,
            'condition_noted': condition
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)