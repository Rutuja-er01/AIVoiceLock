import os
import numpy as np
from sklearn.svm import SVC

from ai.speech_to_text import speech_to_text
from ai.mfcc_extractor import extract_mfcc

# -----------------------------
# Train Speaker Recognition Model
# -----------------------------

current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "..", "dataset")

X = []
y = []

for person in os.listdir(dataset_path):

    person_path = os.path.join(dataset_path, person)

    if not os.path.isdir(person_path):
        continue

    for file in os.listdir(person_path):

        if file.endswith(".mpeg"):

            audio = os.path.join(person_path, file)

            X.append(extract_mfcc(audio))
            y.append(person)

X = np.array(X)
y = np.array(y)

model = SVC(kernel="linear")
model.fit(X, y)

print("Speaker model trained!")


# -----------------------------
# Authentication Function
# -----------------------------

def authenticate(audio_path):

    # Speech Recognition
    phrase_ok, detected_text = speech_to_text(audio_path)

    # Speaker Recognition
    feature = extract_mfcc(audio_path).reshape(1, -1)

    speaker = model.predict(feature)[0]

    access = phrase_ok and speaker == "vaishnavi"

    return {
        "phrase": detected_text,
        "speaker": speaker,
        "access": access
    }


# -----------------------------
# Run only if executed directly
# -----------------------------

if __name__ == "__main__":

    test_audio = os.path.join(current_dir, "..", "uploads", "Recording.mpeg")

    result = authenticate(test_audio)

    print("\nDetected Phrase :", result["phrase"])
    print("Detected Speaker:", result["speaker"])

    if result["access"]:
        print("\n✅ ACCESS GRANTED")
    else:
        print("\n❌ ACCESS DENIED")