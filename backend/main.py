from fastapi import FastAPI, UploadFile, File
import shutil
import os

from ai.voice_authenticator import authenticate

app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Voice Authentication API Running"}


@app.post("/authenticate")
async def authenticate_user(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, "Recording.mpeg")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = authenticate(file_path)

    return result