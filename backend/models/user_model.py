from pydantic import BaseModel, EmailStr


class User(BaseModel):
    name: str
    email: EmailStr
    password: str
class LoginUser(BaseModel):
    email: EmailStr
    password: str
class UpdateUser(BaseModel):
    name: str
class ChangePassword(BaseModel):
    old_password: str
    new_password: str