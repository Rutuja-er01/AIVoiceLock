from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()


MONGO_URL = os.getenv("MONGO_URL")


client = MongoClient(MONGO_URL)


database = client["VoiceLockDB"]


users_collection = database["users"]
voice_collection = database["voice_samples"]