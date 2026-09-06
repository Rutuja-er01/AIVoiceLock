from ai.speech_to_text import (
    speech_to_text,
    normalize_phrase
)

from ai.wespeaker_verification import compare_speakers


# =========================================================
# VERIFY PHRASE
# =========================================================

def verify_phrase(
    detected_phrase,
    registered_phrase
):

    detected = normalize_phrase(
        detected_phrase
    )

    registered = normalize_phrase(
        registered_phrase
    )

    return detected == registered


# =========================================================
# AUTHENTICATE
# =========================================================

def authenticate(
    audio_path,
    registered_audio,
    expected_phrase
):

    # =====================================================
    # PHRASE VERIFICATION
    # =====================================================

    detected_text = speech_to_text(
        audio_path
    )

    phrase_ok = verify_phrase(
        detected_text,
        expected_phrase
    )


    # =====================================================
    # SPEAKER VERIFICATION
    # =====================================================

    similarity, speaker_match, threshold = compare_speakers(
        registered_audio,
        audio_path
    )


    # =====================================================
    # FINAL DECISION
    # =====================================================

    access = (
        phrase_ok
        and
        speaker_match
    )


    # =====================================================
    # DEBUG
    # =====================================================

    print(
        "Registered phrase:",
        expected_phrase
    )

    print(
        "Detected phrase:",
        detected_text
    )

    print(
        "Phrase correct:",
        phrase_ok
    )

    print(
        "WeSpeaker similarity:",
        round(
            similarity,
            4
        )
    )

    print(
        "WeSpeaker threshold:",
        threshold
    )

    print(
        "Speaker match:",
        speaker_match
    )

    print(
        "FINAL ACCESS:",
        access
    )


    return {

        "phrase":
        detected_text,

        "phrase_ok":
        phrase_ok,

        "similarity":
        round(
            similarity,
            4
        ),

        "threshold":
        threshold,

        "speaker_match":
        speaker_match,

        "access":
        access

    }