from fastapi import APIRouter, UploadFile, File, Depends
from utils.auth_dependency import get_current_user
from config.database import voice_collection
from ai.voice_authenticator import authenticate
import shutil
import os
from datetime import datetime, UTC

router = APIRouter()

UPLOAD_FOLDER = "uploads/voices"

# Create the uploads/voices folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_voice(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    # Get email from JWT payload
    email = current_user["email"]

    # Check if voice already exists
    existing_voice = voice_collection.find_one({"email": email})

    if existing_voice:
        return {
            "message": "Voice already exists. Please use Update Voice."
        }

    # Create file path
    file_path = os.path.join(UPLOAD_FOLDER, f"{email}_{file.filename}")

    # Save audio file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save details in MongoDB
    voice_collection.insert_one({
        "email": email,
        "filename": file.filename,
        "path": file_path,
        "uploaded_at": datetime.now(UTC)
    })

    return {
        "message": "Voice uploaded successfully",
        "file": file.filename,
        "path": file_path
    }


@router.get("/my-voice")
def get_my_voice(current_user=Depends(get_current_user)):
    # Get email from JWT payload
    email = current_user["email"]

    # Find the user's voice
    voice = voice_collection.find_one(
        {"email": email},
        {"_id": 0}
    )

    if voice is None:
        return {
            "message": "No voice found"
        }

    return voice


@router.delete("/delete")
def delete_voice(current_user=Depends(get_current_user)):
    email = current_user["email"]

    # Find user's voice
    voice = voice_collection.find_one({"email": email})

    if voice is None:
        return {
            "message": "No voice found"
        }

    # Delete voice file
    if os.path.exists(voice["path"]):
        os.remove(voice["path"])

    # Delete MongoDB record
    voice_collection.delete_one({"email": email})

    return {
        "message": "Voice deleted successfully"
    }


@router.put("/update")
def update_voice(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    email = current_user["email"]

    # Find existing voice
    old_voice = voice_collection.find_one({"email": email})

    if old_voice is None:
        return {
            "message": "No voice found. Please upload a voice first."
        }

    old_path = old_voice["path"]

    # Delete old file
    if os.path.exists(old_path):
        os.remove(old_path)

    # Delete old database record
    voice_collection.delete_one({"email": email})

    # Create new file path
    file_path = os.path.join(
        UPLOAD_FOLDER,
        f"{email}_{file.filename}"
    )

    # Save new voice file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save new details
    voice_collection.insert_one({
        "email": email,
        "filename": file.filename,
        "path": file_path,
        "uploaded_at": datetime.now(UTC)
    })

    return {
        "message": "Voice updated successfully",
        "file": file.filename,
        "path": file_path
    }