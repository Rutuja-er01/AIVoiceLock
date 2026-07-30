from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

from register import register_user
from ai.authenticate import authenticate


app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "AIVoiceLock API running"
    }


@app.post("/register")
async def register(
    username: str = Form(...),
    passphrase: str = Form(...),
    audio: UploadFile = File(...)
):

    os.makedirs("temp", exist_ok=True)

    audio_path = f"temp/{audio.filename}"

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


    return result



@app.post("/authenticate")
async def verify(
    audio: UploadFile = File(...)
):

    os.makedirs("temp", exist_ok=True)

    audio_path = f"temp/{audio.filename}"


    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(
            audio.file,
            buffer
        )


    result = authenticate(audio_path)


    return result