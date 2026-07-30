import os
import joblib
import numpy as np

from ai.mfcc_extractor import extract_mfcc


def predict_speaker(audio_file):

    current_dir = os.path.dirname(os.path.abspath(__file__))

    model_path = os.path.join(
        current_dir,
        "speaker_model.pkl"
    )

    # Load trained model
    model = joblib.load(model_path)

    # Extract MFCC features
    features = extract_mfcc(audio_file)

    # Convert shape for SVM
    features = np.array(features).reshape(1, -1)

    # Predict speaker
    prediction = model.predict(features)

    return str(prediction[0])

if __name__ == "__main__":

    test_audio = "test.wav"

    speaker = predict_speaker(test_audio)

    print("Detected Speaker:", speaker)