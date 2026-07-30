import os
import joblib

from ai.speech_to_text import speech_to_text
from ai.mfcc_extractor import extract_mfcc

# -----------------------------
# Load Trained Speaker Model
# -----------------------------
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "speaker_model.pkl")

model = joblib.load(model_path)

print("Speaker model loaded successfully!")

# -----------------------------
# Authentication Function
# -----------------------------
def authenticate(audio_path):

    # Speech Recognition
    phrase_ok, detected_text = speech_to_text(audio_path)

    # Speaker Recognition
    feature = extract_mfcc(audio_path).reshape(1, -1)

    speaker = model.predict(feature)[0]

    access = phrase_ok and speaker == "vaishnavi"

    return {
        "phrase": detected_text,
        "speaker": speaker,
        "access": access
    }