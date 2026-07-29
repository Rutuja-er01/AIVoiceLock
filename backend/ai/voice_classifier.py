import os
import numpy as np
from sklearn.svm import SVC
from mfcc_extractor import extract_mfcc

# Dataset path
current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "..", "dataset")

X = []
y = []

# Read every folder
for person in os.listdir(dataset_path):

    person_path = os.path.join(dataset_path, person)

    if not os.path.isdir(person_path):
        continue

    for file in os.listdir(person_path):

        if file.endswith(".mpeg"):

            audio = os.path.join(person_path, file)

            features = extract_mfcc(audio)

            X.append(features)

            y.append(person)

X = np.array(X)
y = np.array(y)

print("Training samples:", len(X))

model = SVC(kernel="linear")

model.fit(X, y)

print("Training Complete!")