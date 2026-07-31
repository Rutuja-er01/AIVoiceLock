import whisper

print("Loading Whisper model...")
model = whisper.load_model("base")
print("Model loaded successfully!")

PASS_PHRASE = "open the voice lock"

def speech_to_text(audio_path):
    result = model.transcribe(audio_path, fp16=False)

    text = result["text"].strip()

    print("Detected:", text)

    # Normalize both strings
    detected = text.lower().strip().replace(".", "")
    expected = PASS_PHRASE.lower().strip().replace(".", "")

    matched = detected == expected

    return matched, text