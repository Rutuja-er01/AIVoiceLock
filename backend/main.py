import os

FFMPEG_BIN = r"C:\Users\rutuja\Downloads\ffmpeg-9.0.1-full_build-shared\ffmpeg-9.0.1-full_build-shared\bin"

if os.path.isdir(FFMPEG_BIN):
    os.add_dll_directory(FFMPEG_BIN)
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os

from routes import voice
from register import register_user
from ai.authenticate import authenticate

from config.database import (
    users_collection,
    voice_collection,
    history_collection
)

from routes.user import router as user_router


app = FastAPI(
    title="AI Voice Lock Backend"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# USER ROUTES
# =========================================================

app.include_router(
    user_router
)


# =========================================================
# VOICE ROUTES
# =========================================================

app.include_router(
    voice.router,
    prefix="/voice",
    tags=["Voice"]
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "AIVoiceLock API running"
    }


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/dashboard")
def get_dashboard():

    try:

        total_users = users_collection.count_documents({})

        total_voice_samples = voice_collection.count_documents({})

        total_verifications = history_collection.count_documents({})

        successful_verifications = history_collection.count_documents(
            {
                "status": "Access Granted"
            }
        )

        failed_verifications = history_collection.count_documents(
            {
                "status": "Access Denied"
            }
        )

        return {

            "total_users": total_users,

            "total_voice_samples": total_voice_samples,

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


# =========================================================
# VOICE HISTORY
# =========================================================

@app.get("/voice/history")
def get_voice_history():

    try:

        history = list(
            history_collection.find(
                {},
                {
                    "_id": 0
                }
            )
        )

        return history

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# USER HISTORY
# =========================================================

@app.get("/voice/history/{username}")
def get_user_history(
    username: str
):

    try:

        user_history = list(
            history_collection.find(
                {
                    "speaker": username
                },
                {
                    "_id": 0
                }
            )
        )

        return user_history

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# OLD REGISTER API
# =========================================================

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


    os.makedirs(
        "temp",
        exist_ok=True
    )


    audio_path = os.path.join(
        "temp",
        audio.filename
    )


    with open(
        audio_path,
        "wb"
    ) as buffer:

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

        os.remove(
            audio_path
        )


    return result


# =========================================================
# OLD AUTHENTICATE API
# =========================================================

@app.post("/authenticate")
async def verify(

    audio: UploadFile = File(...)

):

    if audio.filename == "":

        raise HTTPException(
            status_code=400,
            detail="No audio file uploaded"
        )


    os.makedirs(
        "temp",
        exist_ok=True
    )


    audio_path = os.path.join(
        "temp",
        audio.filename
    )


    with open(
        audio_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            audio.file,
            buffer
        )


    result = authenticate(
        audio_path
    )


    if os.path.exists(audio_path):

        os.remove(
            audio_path
        )


    return result


# =========================================================
# DATABASE TEST
# =========================================================

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