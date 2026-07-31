import librosa
import numpy as np

def extract_mfcc(audio_path):
    # Load audio
    signal, sample_rate = librosa.load(audio_path, sr=16000)

    # Extract 13 MFCC coefficients
    mfcc = librosa.feature.mfcc(
        y=signal,
        sr=sample_rate,
        n_mfcc=13
    )

    # Take the average across time
    mfcc_mean = np.mean(mfcc.T, axis=0)

    return mfcc_mean