import os
import shutil
import json

from database import save_user
from ai.train_model import train_model


def register_user(username, passphrase, audio_files):

    # ---------------- Duplicate Username Check ----------------

    users_file = os.path.join(
        "users",
        "users.json"
    )

    if os.path.exists(users_file):

        with open(users_file, "r") as f:
            users = json.load(f)

        if username in users:
            return {
                "status": "failed",
                "message": "Username already exists"
            }


    # ---------------- Save Audio Files ----------------

    user_folder = os.path.join(
        "dataset",
        username
    )

    os.makedirs(
        user_folder,
        exist_ok=True
    )


    for audio in audio_files:

        destination = os.path.join(
            user_folder,
            os.path.basename(audio)
        )

        shutil.copy(
            audio,
            destination
        )

        print(f"Saved: {destination}")


    # ---------------- Save User ----------------

    save_user(
        username,
        passphrase
    )


    # ---------------- Retrain Model ----------------

    train_model()


    return {
        "status": "User registered",
        "username": username
    }