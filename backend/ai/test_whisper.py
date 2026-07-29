import os
from speech_to_text import speech_to_text

# Get the folder where this file is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Build the full path to Recording.mpeg
audio_path = os.path.join(current_dir, "..", "uploads", "Recording.mpeg")

print("Audio file:", audio_path)

matched, text = speech_to_text(audio_path)

if matched:
    print("Phrase Matched")
else:
    print("Wrong Phrase")

print("Detected:", text)