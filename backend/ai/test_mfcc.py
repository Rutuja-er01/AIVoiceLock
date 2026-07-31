import os
from mfcc_extractor import extract_mfcc

current_dir = os.path.dirname(os.path.abspath(__file__))

audio_path = os.path.join(current_dir, "..", "uploads", "Recording.mpeg")

features = extract_mfcc(audio_path)

print("Number of features:", len(features))
print(features)