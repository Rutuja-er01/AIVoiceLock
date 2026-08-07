from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt import verify_access_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    # Get JWT token from Authorization header
    token = credentials.credentials

    # Verify token
    payload = verify_access_token(token)

    # If token is invalid
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    # Return complete JWT payload
    return payload