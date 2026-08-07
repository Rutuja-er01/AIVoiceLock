from ai.mfcc_extractor import extract_mfcc


def create_voice_embedding(audio_path):

    embedding = extract_mfcc(audio_path)

    return embedding.tolist()