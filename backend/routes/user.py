from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.user_model import User, LoginUser
from config.database import users_collection
from utils.jwt import create_access_token, verify_access_token
from utils.hash import hash_password, verify_password

router = APIRouter()

security = HTTPBearer()


@router.post("/register")
def register_user(user: User):

    user_data = user.model_dump()

    # Check if email already exists
    existing_user = users_collection.find_one(
        {
            "email": user.email
        }
    )

    if existing_user:
        return {
            "message": "Email already exists"
        }

    # Hash password before saving
    user_data["password"] = hash_password(user.password)

    users_collection.insert_one(user_data)

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(user: LoginUser):

    existing_user = users_collection.find_one(
        {
            "email": user.email
        }
    )

    if existing_user is None:
        return {
            "message": "User not found"
        }

    # Verify hashed password
    if not verify_password(user.password, existing_user["password"]):
        return {
            "message": "Incorrect password"
        }

    token = create_access_token(
        {
            "email": user.email
        }
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/profile")
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        return {
            "message": "Invalid Token"
        }

    return {
        "message": "Access Granted",
        "user": payload
    }