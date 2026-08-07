import numpy as np

from ai.speech_to_text import speech_to_text
from ai.mfcc_extractor import extract_mfcc


def authenticate(
    audio_path,
    registered_embedding,
    expected_phrase=None
):

    # -----------------------------
    # Speech Recognition
    # -----------------------------

    phrase_ok = True
    detected_text = ""

    if expected_phrase:
        phrase_ok, detected_text = speech_to_text(audio_path)

    # -----------------------------
    # Speaker Recognition
    # -----------------------------

    current_embedding = extract_mfcc(audio_path)

    registered_embedding = np.array(
        registered_embedding,
        dtype=float
    )

    # -----------------------------
    # Cosine Similarity
    # -----------------------------

    numerator = np.dot(
        current_embedding,
        registered_embedding
    )

    denominator = (
        np.linalg.norm(current_embedding)
        *
        np.linalg.norm(registered_embedding)
    )

    if denominator == 0:
        similarity = 0
    else:
        similarity = numerator / denominator

    # -----------------------------
    # Speaker Verification
    # -----------------------------

    speaker_match = similarity >= 0.75

    access = phrase_ok and speaker_match

    return {
        "phrase": detected_text,
        "similarity": round(float(similarity), 4),
        "speaker_match": speaker_match,
        "access": access
    }