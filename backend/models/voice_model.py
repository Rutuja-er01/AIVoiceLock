from pydantic import BaseModel


class VoiceData(BaseModel):
    filename: str