import json
import os
from datetime import datetime

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

    # ---------------- Save verification history ----------------

    history_folder = "history"
    history_file = os.path.join(
        history_folder,
        "verification_history.json"
    )

    os.makedirs(history_folder, exist_ok=True)

    if os.path.exists(history_file):
        with open(history_file, "r") as f:
            try:
                history = json.load(f)
            except json.JSONDecodeError:
                history = []
    else:
        history = []

    history.append(
        {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "speaker": speaker,
            "status": status,
            "phrase_verified": phrase_verified
        }
    )

    with open(history_file, "w") as f:
        json.dump(history, f, indent=4)

    # ----------------------------------------------------------

    return {
        "status": status,
        "speaker": speaker,
        "phrase_verified": phrase_verified
    }