import os
from pydub import AudioSegment


def convert_to_wav(audio_path):

    # If already wav, return same file
    if audio_path.lower().endswith(".wav"):
        return audio_path

    wav_path = os.path.splitext(audio_path)[0] + ".wav"

    audio = AudioSegment.from_file(audio_path)

    # Required format for MFCC + Whisper
    audio = audio.set_frame_rate(16000)
    audio = audio.set_channels(1)

    audio.export(wav_path, format="wav")

    return wav_path