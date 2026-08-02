import os
import shutil

from database import save_user
from ai.train_model import train_model
from config.database import users_collection


def register_user(username, passphrase, audio_files):

    # ---------------- Duplicate Username Check ----------------

    existing_user = users_collection.find_one(
        {"username": username}
    )

    if existing_user:
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
        "status": "success",
        "message": "User registered successfully",
        "username": username
    }