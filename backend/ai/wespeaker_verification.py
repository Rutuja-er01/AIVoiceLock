import numpy as np
import wespeakerruntime


# =========================================================
# LOAD WESPEAKER MODEL
# =========================================================

print("Loading WeSpeaker model...")

speaker_model = wespeakerruntime.Speaker()

print("WeSpeaker model loaded successfully!")


# =========================================================
# EXTRACT SPEAKER EMBEDDING
# =========================================================

def extract_speaker_embedding(audio_path):
    """
    Extract a speaker embedding from an audio file.

    WeSpeaker may return the embedding with shape:
        (1, 256)

    Cosine similarity requires:
        (256,)

    Therefore, we flatten the embedding before returning it.
    """

    embedding = speaker_model.extract_embedding(
        audio_path
    )

    # Convert to NumPy float32 array
    embedding = np.asarray(
        embedding,
        dtype=np.float32
    )

    # Convert (1, 256) -> (256,)
    embedding = embedding.reshape(-1)

    print(
        "Embedding shape:",
        embedding.shape
    )

    # Safety check
    if embedding.size == 0:
        raise ValueError(
            "Speaker embedding is empty."
        )

    return embedding


# =========================================================
# COMPARE TWO SPEAKERS
# =========================================================

def compare_speakers(
    registered_audio,
    current_audio
):
    """
    Compare the registered user's voice
    with the current authentication voice.

    Returns:
        similarity
        speaker_match
        threshold
    """

    # -----------------------------------------------------
    # Extract registered user's voice embedding
    # -----------------------------------------------------

    registered_embedding = extract_speaker_embedding(
        registered_audio
    )

    # -----------------------------------------------------
    # Extract current authentication voice embedding
    # -----------------------------------------------------

    current_embedding = extract_speaker_embedding(
        current_audio
    )

    # -----------------------------------------------------
    # Check embedding dimensions
    # -----------------------------------------------------

    if registered_embedding.shape != current_embedding.shape:
        raise ValueError(
            f"Embedding shape mismatch: "
            f"registered={registered_embedding.shape}, "
            f"current={current_embedding.shape}"
        )

    # -----------------------------------------------------
    # Calculate cosine similarity
    # -----------------------------------------------------

    similarity = speaker_model.compute_cosine_score(
        registered_embedding,
        current_embedding
    )

    similarity = float(similarity)

    # -----------------------------------------------------
    # Speaker verification threshold
    # -----------------------------------------------------

    threshold = 0.70

    speaker_match = (
        similarity >= threshold
    )

    # -----------------------------------------------------
    # Debug information
    # -----------------------------------------------------

    print(
        "WeSpeaker similarity:",
        round(similarity, 4)
    )

    print(
        "WeSpeaker threshold:",
        threshold
    )

    print(
        "Speaker match:",
        speaker_match
    )

    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return (
        similarity,
        speaker_match,
        threshold
    )