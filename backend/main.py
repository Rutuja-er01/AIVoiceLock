from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import shutil
import os
import json

from register import register_user
from ai.authenticate import authenticate


app = FastAPI()


# ---------------- Home API ----------------
@app.get("/")
def home():
    return {
        "message": "AIVoiceLock API running"
    }


# ---------------- Dashboard API ----------------
@app.get("/dashboard")
def get_dashboard():

    try:
        users_file = os.path.join(
            "users",
            "users.json"
        )

        if os.path.exists(users_file):
            with open(users_file, "r") as f:
                users = json.load(f)
        else:
            users = {}


        history_file = os.path.join(
            "history",
            "verification_history.json"
        )

        if os.path.exists(history_file):
            with open(history_file, "r") as f:
                history = json.load(f)
        else:
            history = []


        total_verifications = len(history)

        successful_verifications = sum(
            1 for item in history
            if item["status"] == "Access Granted"
        )

        failed_verifications = (
            total_verifications -
            successful_verifications
        )


        return {
            "total_users": len(users),
            "registered_users": list(users.keys()),
            "total_verifications": total_verifications,
            "successful_verifications": successful_verifications,
            "failed_verifications": failed_verifications,
            "system_status": "Running"
        }


    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ---------------- Voice History API ----------------
@app.get("/voice/history")
def get_voice_history():

    try:
        history_file = os.path.join(
            "history",
            "verification_history.json"
        )


        if not os.path.exists(history_file):
            return []


        with open(history_file, "r") as f:
            history = json.load(f)


        return history


    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



# ---------------- User History API ----------------
@app.get("/voice/history/{username}")
def get_user_history(username: str):

    try:
        history_file = os.path.join(
            "history",
            "verification_history.json"
        )


        if not os.path.exists(history_file):
            return []


        with open(history_file, "r") as f:
            history = json.load(f)


        user_history = [
            item for item in history
            if item["speaker"].lower()
            == username.lower()
        ]


        return user_history


    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



# ---------------- Register API ----------------
@app.post("/register")
async def register(
    username: str = Form(...),
    passphrase: str = Form(...),
    audio: UploadFile = File(...)
):

    if username.strip() == "":
        raise HTTPException(
            status_code=400,
            detail="Username cannot be empty"
        )


    if passphrase.strip() == "":
        raise HTTPException(
            status_code=400,
            detail="Passphrase cannot be empty"
        )


    if audio.filename == "":
        raise HTTPException(
            status_code=400,
            detail="No audio file uploaded"
        )


    # 10 MB file size limit
    MAX_FILE_SIZE = 10 * 1024 * 1024


    audio.file.seek(0, 2)
    file_size = audio.file.tell()
    audio.file.seek(0)


    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Audio file size should be less than 10MB"
        )


    allowed_extensions = [
        ".wav",
        ".mp3",
        ".mpeg"
    ]


    extension = os.path.splitext(
        audio.filename
    )[1].lower()


    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only WAV, MP3 and MPEG files are allowed."
        )


    os.makedirs(
        "temp",
        exist_ok=True
    )


    audio_path = os.path.join(
        "temp",
        audio.filename
    )


    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(
            audio.file,
            buffer
        )


    result = register_user(
        username,
        passphrase,
        [audio_path]
    )

    if os.path.exists(audio_path):
        os.remove(audio_path)


    return result




# ---------------- Authenticate API ----------------
@app.post("/authenticate")
async def verify(
    audio: UploadFile = File(...)
):

    if audio.filename == "":
        raise HTTPException(
            status_code=400,
            detail="No audio file uploaded"
        )


    MAX_FILE_SIZE = 10 * 1024 * 1024


    audio.file.seek(0, 2)
    file_size = audio.file.tell()
    audio.file.seek(0)


    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Audio file size should be less than 10MB"
        )


    allowed_extensions = [
        ".wav",
        ".mp3",
        ".mpeg"
    ]


    extension = os.path.splitext(
        audio.filename
    )[1].lower()


    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only WAV, MP3 and MPEG files are allowed."
        )


    os.makedirs(
        "temp",
        exist_ok=True
    )


    audio_path = os.path.join(
        "temp",
        audio.filename
    )


    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(
            audio.file,
            buffer
        )


    result = authenticate(
        audio_path
    )
    if os.path.exists(audio_path):
        os.remove(audio_path)


    return result