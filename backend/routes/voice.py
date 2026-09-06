from fastapi import APIRouter, UploadFile, File, Depends

from utils.auth_dependency import get_current_user

from config.database import (
    voice_collection,
    history_collection
)

from ai.voice_authenticator import authenticate

from ai.voice_register import create_voice_embedding

from ai.speech_to_text import (
    speech_to_text,
    normalize_phrase
)

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


    # =====================================================
    # CHECK IF VOICE ALREADY EXISTS
    # =====================================================

    existing_voice = voice_collection.find_one(
        {
            "email": email
        }
    )


    if existing_voice:

        return {

            "message":
            "Voice already exists. Please use Update Voice."

        }


    # =====================================================
    # CREATE FILE PATH
    # =====================================================

    file_path = os.path.join(

        UPLOAD_FOLDER,

        f"{email}_{file.filename}"

    )


    # =====================================================
    # SAVE AUDIO
    # =====================================================

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # =====================================================
    # DETECT REGISTERED PHRASE
    # =====================================================

    registered_phrase = speech_to_text(
        file_path
    )


    registered_phrase = registered_phrase.strip()


    # =====================================================
    # CHECK EMPTY PHRASE
    # =====================================================

    if not registered_phrase:

        if os.path.exists(file_path):

            os.remove(file_path)

        return {

            "message":
            "Could not detect a voice phrase. Please record again."

        }


    # =====================================================
    # CREATE VOICE EMBEDDING
    # =====================================================

    embedding = create_voice_embedding(
        file_path
    )


    # =====================================================
    # SAVE VOICE PROFILE
    # =====================================================

    voice_collection.insert_one({

        "email": email,

        "filename": file.filename,

        "path": file_path,

        "embedding": embedding,

        "phrase": registered_phrase,

        "phrase_normalized":
        normalize_phrase(
            registered_phrase
        ),

        "uploaded_at": datetime.now(UTC)

    })


    return {

        "message":
        "Voice profile created successfully",

        "file":
        file.filename,

        "phrase":
        registered_phrase

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


    # =====================================================
    # FIND REGISTERED VOICE
    # =====================================================

    voice = voice_collection.find_one(

        {
            "email": email
        }

    )


    if voice is None:

        return {

            "access": False,

            "message":
            "No voice profile found. Please create your voice profile first."

        }


    # =====================================================
    # CHECK REGISTERED PHRASE
    # =====================================================

    registered_phrase = voice.get(
        "phrase"
    )


    if not registered_phrase:

        return {

            "access": False,

            "message":
            "Your voice profile does not have a registered phrase. Please delete and create your voice profile again."

        }


    # =====================================================
    # TEMPORARY AUTHENTICATION FILE
    # =====================================================

    file_path = os.path.join(

        UPLOAD_FOLDER,

        f"verify_{email}_{file.filename}"

    )


    # =====================================================
    # SAVE AUTHENTICATION RECORDING
    # =====================================================

    with open(

        file_path,

        "wb"

    ) as buffer:

        shutil.copyfileobj(

            file.file,

            buffer

        )


    try:

        # =================================================
        # VOICE + PERSONAL PHRASE AUTHENTICATION
        # =================================================

        result = authenticate(

            file_path,

            voice["path"],

            registered_phrase

        )


        # =================================================
        # ACCESS GRANTED
        # =================================================

        if result["access"]:

            history_collection.insert_one({

                "email": email,

                "speaker": email,

                "status":
                "Access Granted",

                "similarity":
                result["similarity"],

                "phrase":
                result["phrase"],

                "timestamp":
                datetime.now(UTC)

            })


            return {

                "access": True,

                "message":
                "Access Granted",

                "speaker":
                "Verified User",

                "similarity":
                result["similarity"],

                "threshold":
                result["threshold"],

                "speaker_match":
                result["speaker_match"],

                "phrase":
                result["phrase"]

            }


        # =================================================
        # ACCESS DENIED
        # =================================================

        else:

            history_collection.insert_one({

                "email": email,

                "speaker": email,

                "status":
                "Access Denied",

                "similarity":
                result["similarity"],

                "phrase":
                result["phrase"],

                "timestamp":
                datetime.now(UTC)

            })


            return {

                "access": False,

                "message":
                "Access Denied",

                "speaker":
                "Speaker or phrase is incorrect",

                "similarity":
                result["similarity"],

                "threshold":
                result["threshold"],

                "speaker_match":
                result["speaker_match"],

                "phrase":
                result["phrase"]

            }


    finally:

        # =================================================
        # DELETE TEMPORARY FILE
        # =================================================

        if os.path.exists(file_path):

            os.remove(file_path)


# =========================================================
# GET MY VOICE
# =========================================================

@router.get("/my-voice")
def get_my_voice(

    current_user=Depends(get_current_user)

):

    email = current_user["email"]


    voice = voice_collection.find_one(

        {
            "email": email
        },

        {
            "_id": 0
        }

    )


    if voice is None:

        return {

            "message":
            "No voice found"

        }


    return voice


# =========================================================
# DELETE VOICE
# =========================================================

@router.delete("/delete")
def delete_voice(

    current_user=Depends(get_current_user)

):

    email = current_user["email"]


    voice = voice_collection.find_one(

        {
            "email": email
        }

    )


    if voice is None:

        return {

            "message":
            "No voice found"

        }


    # =====================================================
    # DELETE OLD AUDIO FILE
    # =====================================================

    if os.path.exists(

        voice["path"]

    ):

        os.remove(

            voice["path"]

        )


    # =====================================================
    # DELETE DATABASE RECORD
    # =====================================================

    voice_collection.delete_one(

        {
            "email": email
        }

    )


    return {

        "message":
        "Voice deleted successfully"

    }


# =========================================================
# UPDATE VOICE
# =========================================================

@router.put("/update")
def update_voice(

    file: UploadFile = File(...),

    current_user=Depends(get_current_user)

):

    email = current_user["email"]


    # =====================================================
    # FIND OLD VOICE
    # =====================================================

    old_voice = voice_collection.find_one(

        {
            "email": email
        }

    )


    if old_voice is None:

        return {

            "message":
            "No voice found. Please create your voice profile first."

        }


    # =====================================================
    # DELETE OLD AUDIO
    # =====================================================

    old_path = old_voice["path"]


    if os.path.exists(old_path):

        os.remove(old_path)


    # =====================================================
    # DELETE OLD DATABASE RECORD
    # =====================================================

    voice_collection.delete_one(

        {
            "email": email
        }

    )


    # =====================================================
    # NEW FILE
    # =====================================================

    file_path = os.path.join(

        UPLOAD_FOLDER,

        f"{email}_{file.filename}"

    )


    # =====================================================
    # SAVE NEW AUDIO
    # =====================================================

    with open(

        file_path,

        "wb"

    ) as buffer:

        shutil.copyfileobj(

            file.file,

            buffer

        )


    # =====================================================
    # DETECT NEW REGISTERED PHRASE
    # =====================================================

    registered_phrase = speech_to_text(

        file_path

    )


    registered_phrase = registered_phrase.strip()


    if not registered_phrase:

        if os.path.exists(file_path):

            os.remove(file_path)

        return {

            "message":
            "Could not detect a voice phrase. Please record again."

        }


    # =====================================================
    # CREATE NEW VOICE EMBEDDING
    # =====================================================

    embedding = create_voice_embedding(

        file_path

    )


    # =====================================================
    # SAVE NEW PROFILE
    # =====================================================

    voice_collection.insert_one({

        "email": email,

        "filename": file.filename,

        "path": file_path,

        "embedding": embedding,

        "phrase": registered_phrase,

        "phrase_normalized":
        normalize_phrase(
            registered_phrase
        ),

        "uploaded_at":
        datetime.now(UTC)

    })


    return {

        "message":
        "Voice profile updated successfully",

        "file":
        file.filename,

        "phrase":
        registered_phrase

    }