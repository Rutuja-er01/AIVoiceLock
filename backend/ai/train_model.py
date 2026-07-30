import os
import numpy as np
import joblib
from sklearn.svm import SVC

from ai.mfcc_extractor import extract_mfcc


def train_model():

    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "..", "dataset")

    X = []
    y = []

    for person in os.listdir(dataset_path):

        person_path = os.path.join(dataset_path, person)

        if not os.path.isdir(person_path):
            continue

        for file in os.listdir(person_path):

            if file.endswith(".wav"):

                audio = os.path.join(person_path, file)

                try:
                    features = extract_mfcc(audio)

                    X.append(features)
                    y.append(person)

                    print(f"Processed: {person}/{file}")

                except Exception as e:
                    print(f"Skipped {file}: {e}")

    if len(X) == 0:
        raise ValueError("No .wav audio files found in dataset")

    X = np.array(X)
    y = np.array(y)

    print("Training SVM model...")

    model = SVC(kernel="linear")
    model.fit(X, y)

    model_path = os.path.join(current_dir, "speaker_model.pkl")

    joblib.dump(model, model_path)

    print("Speaker model trained and saved!")

    return model