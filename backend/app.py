from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import pickle

app = Flask(__name__)
CORS(app) # This lets your Next.js website talk to Python

# Load the AI and the Scaler
model = tf.keras.models.load_model('car_model.h5')
scaler = pickle.load(open('scaler.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # We must prepare the numbers exactly like the training data
    # Example order: [Year, Age, kmDriven, Brand_Encoded...]
    features = np.array([[data['year'], data['age'], data['km']]]) 
    
    # Scale them
    features_scaled = scaler.transform(features)
    
    # Get the AI's prediction
    prediction = model.predict(features_scaled)
    
    return jsonify({'price': float(prediction[0][0])})

if __name__ == '__main__':
    app.run(port=5000)