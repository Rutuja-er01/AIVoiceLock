from speechbrain.inference.speaker import SpeakerRecognition

print("Loading speaker verification model...")

verification = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb"
)

print("Speaker verification model loaded successfully!")