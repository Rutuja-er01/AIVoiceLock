import whisper
from difflib import SequenceMatcher


model = whisper.load_model("base")


def verify_phrase(audio_file, expected_phrase):

    result = model.transcribe(audio_file)

    spoken_text = result["text"].strip().lower()

    expected_phrase = expected_phrase.lower()

    print("Detected text:", spoken_text)

    similarity = SequenceMatcher(
        None,
        spoken_text,
        expected_phrase
    ).ratio()

    print("Similarity:", similarity)

    return similarity >= 0.70