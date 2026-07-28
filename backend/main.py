from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to VoiceLock AI Backend!"}


@app.get("/health")
def health():
    return {"status": "Backend is running successfully!"}