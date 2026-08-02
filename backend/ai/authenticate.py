from datetime import datetime

from ai.predict_speaker import predict_speaker
from ai.verify_phrase import verify_phrase
from config.database import history_collection


def authenticate(audio_path):

    # Speaker verification
    speaker = predict_speaker(audio_path)

    # Phrase verification
    phrase_verified = verify_phrase(
        audio_path,
        "open the voice lock"
    )

    # Final decision
    if speaker and phrase_verified:
        status = "Access Granted"
    else:
        status = "Access Denied"


    # Save verification history in MongoDB
    history_collection.insert_one(
        {
            "time": datetime.now(),
            "speaker": speaker,
            "status": status,
            "phrase_verified": phrase_verified
        }
    )


    return {
        "status": status,
        "speaker": speaker,
        "phrase_verified": phrase_verified
    }