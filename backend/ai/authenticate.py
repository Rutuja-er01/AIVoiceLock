import os

from ai.predict_speaker import predict_speaker
from ai.verify_phrase import verify_phrase


def authenticate(audio_path):

    speaker = predict_speaker(audio_path)

    phrase_verified = verify_phrase(
        audio_path,
        "open the voice lock"
    )


    if speaker and phrase_verified:
        status = "Access Granted"
    else:
        status = "Access Denied"


    return {
        "status": status,
        "speaker": speaker,
        "phrase_verified": phrase_verified
    }