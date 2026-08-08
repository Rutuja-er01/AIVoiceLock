import numpy as np

from ai.speech_to_text import speech_to_text
from ai.mfcc_extractor import extract_mfcc


# Minimum similarity required
SIMILARITY_THRESHOLD = 0.80


def cosine_similarity(vector1, vector2):

    vector1 = np.array(
        vector1,
        dtype=float
    )

    vector2 = np.array(
        vector2,
        dtype=float
    )

    denominator = (
        np.linalg.norm(vector1)
        *
        np.linalg.norm(vector2)
    )

    if denominator == 0:

        return 0.0

    similarity = np.dot(
        vector1,
        vector2
    ) / denominator

    return float(similarity)


def authenticate(
    audio_path,
    registered_embedding,
    expected_phrase=None
):

    # --------------------------------
    # Speech Recognition
    # --------------------------------

    phrase_ok = True
    detected_text = ""

    if expected_phrase:

        phrase_ok, detected_text = speech_to_text(
            audio_path
        )


    # --------------------------------
    # Speaker Recognition
    # --------------------------------

    current_embedding = extract_mfcc(
        audio_path
    )


    registered_embedding = np.array(
        registered_embedding,
        dtype=float
    )


    # --------------------------------
    # Check embedding dimensions
    # --------------------------------

    if current_embedding.shape != registered_embedding.shape:

        raise ValueError(
            "Voice embeddings are incompatible."
        )


    # --------------------------------
    # Cosine Similarity
    # --------------------------------

    similarity = cosine_similarity(
        current_embedding,
        registered_embedding
    )


    # --------------------------------
    # Speaker Verification
    # --------------------------------

    speaker_match = (
        similarity >= SIMILARITY_THRESHOLD
    )


    # --------------------------------
    # Final decision
    # --------------------------------

    access = (
        phrase_ok
        and speaker_match
    )


    return {

        "phrase": detected_text,

        "similarity": round(
            similarity,
            4
        ),

        "threshold": SIMILARITY_THRESHOLD,

        "speaker_match": speaker_match,

        "access": access

    }