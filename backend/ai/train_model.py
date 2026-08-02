import os
import numpy as np
import joblib

from sklearn.svm import SVC

from ai.mfcc_extractor import extract_mfcc


def train_model():

    current_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    dataset_path = os.path.join(
        current_dir,
        "..",
        "dataset"
    )

    X = []
    y = []

    # Loop through each person folder
    for person in os.listdir(dataset_path):

        person_path = os.path.join(
            dataset_path,
            person
        )

        if not os.path.isdir(person_path):
            continue

        # Loop through audio files
        for file in os.listdir(person_path):

            if file.lower().endswith(
                (".wav", ".mpeg", ".mp3")
            ):

                audio_path = os.path.join(
                    person_path,
                    file
                )

                try:

                    # Extract MFCC features
                    features = extract_mfcc(audio_path)

                    # Add features and label
                    X.append(features)
                    y.append(person)

                    print(
                        f"Processed: {person}/{file}"
                    )

                except Exception as e:

                    print(
                        f"Skipped {person}/{file}: {e}"
                    )


    # Check dataset
    if len(X) == 0:
        raise ValueError(
            "No supported audio files found in dataset"
        )


    # Convert lists to numpy arrays
    X = np.array(X)
    y = np.array(y)


    print("Training SVM model...")


    # Create SVM classifier
    model = SVC(
        kernel="linear"
    )


    # Train model
    model.fit(
        X,
        y
    )


    # Save trained model
    model_path = os.path.join(
        current_dir,
        "speaker_model.pkl"
    )


    joblib.dump(
        model,
        model_path
    )


    print(
        "Speaker model trained and saved!"
    )


    return model



if __name__ == "__main__":
    train_model()