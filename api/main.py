from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os
import tensorflow as tf

app = Flask(__name__)
CORS(app)

def build_model(input_shape):
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(input_shape,)),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(1)
    ])
    return model

base_path = os.path.dirname(__file__)
scaler_path = os.path.join(base_path, 'scaler.pkl')
weights_path = os.path.join(base_path, 'model_weights.weights.h5')

try:
    scaler = pickle.load(open(scaler_path, 'rb'))
    input_dim = scaler.n_features_in_
    model = build_model(input_dim)
    model.load_weights(weights_path)
    print("AI Model weights loaded successfully!")
except Exception as e:
    print(f"ERROR DURING STARTUP: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    # ... your prediction logic ...
    try:
        data = request.json
        # 1. Get the 3 numbers from your website
        input_data = [
            float(data['year']), 
            float(data['age']), 
            float(data['kmDriven'])
        ]
        
        # 2. Pad with zeros for the remaining columns
        num_missing = input_dim - len(input_data)
        final_input = np.array([input_data + [0] * num_missing])
        
        # 3. Scale and Predict
        scaled_features = scaler.transform(final_input)
        prediction = model.predict(scaled_features)
        
        return jsonify({'price': float(prediction[0][0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)