import os
import shutil

from database import save_user
from ai.train_model import train_model


def register_user(username, passphrase, audio_files):

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


    save_user(
        username,
        passphrase
    )


    train_model()


    return {
        "status": "User registered",
        "username": username
    }