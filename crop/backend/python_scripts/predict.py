import numpy as np
import onnxruntime as ort
from flask import Flask, request, jsonify

# Initialize Flask app
app = Flask(__name__)

# Load the ONNX model
onnx_model_path = "model.onnx"  # Replace with your model path
ort_session = ort.InferenceSession('/home/perez/Crop-Disease-Classifiier/crop/backend/random_forest.onnx')

def predict(input_data):
    """
    Run inference using the ONNX model.
    Args:
        input_data: Preprocessed input (numpy array or list)
    Returns:
        Model prediction
    """
    # Convert input to the correct format (adjust based on your model)
    input_name = ort_session.get_inputs()[0].name
    output_name = ort_session.get_outputs()[0].name

    # Run inference
    result = ort_session.run([output_name], {input_name: np.array(input_data, dtype=np.float32)})
    return result[0]

# API endpoint for predictions
@app.route('/predict', methods=['POST'])
def handle_predict():
    try:
        data = request.get_json()
        user_input = data['input']  # Expects {"input": [...]}

        # Preprocess input if needed (e.g., tokenization, reshaping)
        processed_input = preprocess(user_input)  # Define your preprocessing function

        # Get prediction
        prediction = predict(processed_input)

        # Post-process output (e.g., convert to readable format)
        response = {"prediction": prediction.tolist()}  # Convert numpy array to list
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def preprocess(input_data):
    """
    Preprocess input before feeding to the model.
    (Adjust based on your model's requirements.)
    """
    # Example: Convert text to embeddings, normalize, reshape, etc.
    return input_data

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)