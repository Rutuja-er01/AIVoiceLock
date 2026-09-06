import whisper

print("Loading Whisper model...")

model = whisper.load_model("base")

print("Model loaded successfully!")


def speech_to_text(audio_path):
    """
    Convert audio to text using Whisper.
    Returns:
        matched -> not calculated here
        text    -> detected spoken phrase
    """

    result = model.transcribe(
        audio_path,
        fp16=False
    )

    text = result["text"].strip()

    print("Detected:", text)

    return text


def normalize_phrase(text):
    """
    Normalize phrase before comparison.
    Removes punctuation and extra spaces.
    """

    text = text.lower().strip()

    # Remove common punctuation
    for character in [".", ",", "!", "?", ";", ":"]:
        text = text.replace(character, "")

    # Remove extra spaces
    text = " ".join(text.split())

    return text