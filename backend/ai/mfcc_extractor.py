import librosa
import numpy as np


def extract_mfcc(audio_path):

    # Load audio
    signal, sample_rate = librosa.load(
        audio_path,
        sr=16000,
        mono=True
    )

    # --------------------------------
    # Validate audio
    # --------------------------------

    if signal is None or len(signal) == 0:
        raise ValueError("Audio recording is empty.")

    # Calculate duration
    duration = len(signal) / sample_rate

    if duration < 1.5:
        raise ValueError(
            "Recording is too short. Please speak for at least 1.5 seconds."
        )

    # --------------------------------
    # Check whether user actually spoke
    # --------------------------------

    rms = librosa.feature.rms(y=signal)

    average_volume = float(np.mean(rms))

    # Very low volume = silence
    if average_volume < 0.005:
        raise ValueError(
            "No clear speech detected. Please speak clearly into the microphone."
        )

    # --------------------------------
    # Normalize audio
    # --------------------------------

    signal = librosa.util.normalize(signal)

    # --------------------------------
    # MFCC
    # --------------------------------

    mfcc = librosa.feature.mfcc(
        y=signal,
        sr=sample_rate,
        n_mfcc=20
    )

    # --------------------------------
    # MFCC statistics
    # --------------------------------

    mfcc_mean = np.mean(mfcc, axis=1)

    mfcc_std = np.std(mfcc, axis=1)

    # --------------------------------
    # Delta
    # --------------------------------

    delta = librosa.feature.delta(mfcc)

    delta_mean = np.mean(delta, axis=1)

    # --------------------------------
    # Delta Delta
    # --------------------------------

    delta2 = librosa.feature.delta(
        mfcc,
        order=2
    )

    delta2_mean = np.mean(delta2, axis=1)

    # --------------------------------
    # Combine features
    # --------------------------------

    features = np.concatenate([
        mfcc_mean,
        mfcc_std,
        delta_mean,
        delta2_mean
    ])

    # --------------------------------
    # Final validation
    # --------------------------------

    if not np.all(np.isfinite(features)):
        raise ValueError(
            "Invalid audio features generated."
        )

    return features