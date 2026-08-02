from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import shutil
import os
import json

from routes import voice
from register import register_user
from ai.authenticate import authenticate

from config.database import users_collection
from routes.user import router as user_router

app = FastAPI(
    title="AI Voice Lock Backend"
)

# Register all user-related APIs
app.include_router(user_router)
app.include_router(
    voice.router,
    prefix="/voice",
    tags=["Voice"]
)


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
        users_file = os.path.join("users", "users.json")

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
            if item["speaker"].lower() == username.lower()
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

    os.makedirs("temp", exist_ok=True)

    audio_path = os.path.join(
        "temp",
        audio.filename
    )

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

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

    os.makedirs("temp", exist_ok=True)

    audio_path = os.path.join(
        "temp",
        audio.filename
    )

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    result = authenticate(audio_path)

    if os.path.exists(audio_path):
        os.remove(audio_path)

    return result


# ---------------- Database Test API ----------------
@app.get("/test-db")
def test_database():
    users_collection.insert_one(
        {
            "name": "Test User",
            "email": "test@gmail.com"
        }
    )

    return {
        "message": "Database connected"
    }