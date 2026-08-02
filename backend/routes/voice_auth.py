from fastapi import APIRouter, UploadFile, File, Depends
from utils.auth_dependency import get_current_user
from ai.authenticate import authenticate
import shutil
import os

router = APIRouter()

TEMP_FOLDER = "uploads/temp"

os.makedirs(TEMP_FOLDER, exist_ok=True)


@router.post("/verify")
def verify_voice(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    file_path = os.path.join(
        TEMP_FOLDER,
        file.filename
    )

    # Save uploaded audio temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Call AI model
    result = authenticate(file_path)

    # Remove temporary file
    os.remove(file_path)

    return result