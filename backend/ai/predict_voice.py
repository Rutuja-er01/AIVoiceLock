import os
import joblib
import numpy as np

from ai.mfcc_extractor import extract_mfcc


def predict_speaker(audio_path):

    current_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    model_path = os.path.join(
        current_dir,
        "speaker_model.pkl"
    )

    # Load trained model
    model = joblib.load(model_path)

    # Extract MFCC features
    features = extract_mfcc(audio_path)

    # Convert for SVM input
    features = np.array(features).reshape(1, -1)

    # Predict speaker
    prediction = model.predict(features)

    return prediction[0]


if __name__ == "__main__":

    test_audio = "test.wav"

    result = predict_speaker(test_audio)

    print("Detected Speaker:", result)