from fastapi import APIRouter, UploadFile, File, Depends

from utils.auth_dependency import get_current_user
from config.database import voice_collection

from ai.voice_authenticator import authenticate
from ai.voice_register import create_voice_embedding

import shutil
import os

from datetime import datetime, UTC


router = APIRouter()


UPLOAD_FOLDER = "uploads/voices"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# =========================================================
# CREATE VOICE PROFILE
# =========================================================

@router.post("/upload")
def upload_voice(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    email = current_user["email"]

    # Check if voice already exists
    existing_voice = voice_collection.find_one(
        {"email": email}
    )

    if existing_voice:

        return {
            "message": "Voice already exists. Please use Update Voice."
        }

    # Create unique file path
    file_path = os.path.join(
        UPLOAD_FOLDER,
        f"{email}_{file.filename}"
    )

    # Save audio
    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Create voice embedding
    embedding = create_voice_embedding(
        file_path
    )

    # Save voice profile
    voice_collection.insert_one({

        "email": email,

        "filename": file.filename,

        "path": file_path,

        "embedding": embedding,

        "uploaded_at": datetime.now(UTC)

    })

    return {

        "message": "Voice profile created successfully",

        "file": file.filename

    }


# =========================================================
# AUTHENTICATE VOICE
# =========================================================

@router.post("/verify")
def verify_voice(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    email = current_user["email"]

    # Find registered voice
    voice = voice_collection.find_one(
        {"email": email}
    )

    if voice is None:

        return {

            "access": False,

            "message": "No voice profile found. Please create your voice profile first."

        }

    # Temporary authentication file
    file_path = os.path.join(
        UPLOAD_FOLDER,
        f"verify_{email}_{file.filename}"
    )

    # Save authentication recording
    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:

        # Authenticate against user's registered embedding
        result = authenticate(
            file_path,
            voice["embedding"]
        )

        if result["access"]:

            return {

                "access": True,

                "message": "Access Granted",

                "speaker": "Verified User",

                "similarity": result["similarity"]

            }

        else:

            return {

                "access": False,

                "message": "Access Denied",

                "speaker": "Speaker is different",

                "similarity": result["similarity"]

            }

    finally:

        # Delete temporary verification recording
        if os.path.exists(file_path):

            os.remove(file_path)


# =========================================================
# GET MY VOICE PROFILE
# =========================================================

@router.get("/my-voice")
def get_my_voice(
    current_user=Depends(get_current_user)
):

    email = current_user["email"]

    voice = voice_collection.find_one(
        {"email": email},
        {"_id": 0}
    )

    if voice is None:

        return {
            "message": "No voice found"
        }

    return voice


# =========================================================
# DELETE VOICE PROFILE
# =========================================================

@router.delete("/delete")
def delete_voice(
    current_user=Depends(get_current_user)
):

    email = current_user["email"]

    voice = voice_collection.find_one(
        {"email": email}
    )

    if voice is None:

        return {
            "message": "No voice found"
        }

    # Delete audio file
    if os.path.exists(voice["path"]):

        os.remove(
            voice["path"]
        )

    # Delete MongoDB record
    voice_collection.delete_one(
        {"email": email}
    )

    return {

        "message": "Voice deleted successfully"

    }


# =========================================================
# UPDATE VOICE PROFILE
# =========================================================

@router.put("/update")
def update_voice(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    email = current_user["email"]

    old_voice = voice_collection.find_one(
        {"email": email}
    )

    if old_voice is None:

        return {

            "message": "No voice found. Please create a voice profile first."

        }

    # Delete old audio
    old_path = old_voice["path"]

    if os.path.exists(old_path):

        os.remove(old_path)

    # Delete old MongoDB record
    voice_collection.delete_one(
        {"email": email}
    )

    # New file path
    file_path = os.path.join(
        UPLOAD_FOLDER,
        f"{email}_{file.filename}"
    )

    # Save new audio
    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Create NEW embedding
    embedding = create_voice_embedding(
        file_path
    )

    # Save new profile
    voice_collection.insert_one({

        "email": email,

        "filename": file.filename,

        "path": file_path,

        "embedding": embedding,

        "uploaded_at": datetime.now(UTC)

    })

    return {

        "message": "Voice profile updated successfully",

        "file": file.filename

    }