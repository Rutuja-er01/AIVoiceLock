import librosa
import numpy as np


def extract_mfcc(audio_path):

    # Load audio file
    signal, sample_rate = librosa.load(
        audio_path,
        sr=16000
    )

    # Extract MFCC features
    mfcc = librosa.feature.mfcc(
        y=signal,
        sr=sample_rate,
        n_mfcc=20
    )

    # MFCC mean and standard deviation
    mfcc_mean = np.mean(mfcc, axis=1)
    mfcc_std = np.std(mfcc, axis=1)

    # Delta MFCC
    delta = librosa.feature.delta(mfcc)
    delta_mean = np.mean(delta, axis=1)

    # Delta-Delta MFCC
    delta2 = librosa.feature.delta(
        mfcc,
        order=2
    )
    delta2_mean = np.mean(delta2, axis=1)

    # Combine all extracted features
    features = np.concatenate([
        mfcc_mean,
        mfcc_std,
        delta_mean,
        delta2_mean
    ])

    return features