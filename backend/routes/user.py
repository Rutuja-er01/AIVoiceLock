from fastapi import APIRouter
from models.user_model import User, LoginUser
from config.database import users_collection

router = APIRouter()

@router.post("/user/register")
def register_user(user: User):

    user_data = user.model_dump()

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

    if existing_user["password"] != user.password:
        return {
            "message": "Incorrect password"
        }

    return {
        "message": "Login successful"
    }