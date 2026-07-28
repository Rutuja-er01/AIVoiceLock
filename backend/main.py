from fastapi import FastAPI
from config.database import users_collection
from routes.user import router as user_router

app = FastAPI(
    title="AI Voice Lock Backend"
)

# Register all user-related APIs
app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }


@app.get("/test-db")
def test_database():

    users_collection.insert_one(
        {
            "name": "Test User",
            "email": "test@gmail.com"
        }
    )

    return {
        "message": "Database connected"
    }

  