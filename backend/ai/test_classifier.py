import os
import numpy as np
from sklearn.svm import SVC
from mfcc_extractor import extract_mfcc

current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "..", "dataset")

X = []
y = []

# Load training data
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

# Train classifier
model = SVC(kernel="linear")
model.fit(X, y)

# Load test audio
test_audio = os.path.join(current_dir, "..", "uploads", "Recording.mpeg")

test_feature = extract_mfcc(test_audio).reshape(1, -1)

prediction = model.predict(test_feature)

print("Predicted Speaker:", prediction[0])