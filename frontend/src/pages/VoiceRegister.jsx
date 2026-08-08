import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import RecordRTC from "recordrtc";
import "./VoiceRegister.css";

function VoiceRegister() {

  const navigate = useNavigate();
  const location = useLocation();

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Opened from Update Voice
  const isUpdate = location.state?.update === true;


  // ==========================================
  // START RECORDING
  // ==========================================

  const startRecording = async () => {

    try {

      setMessage("");
      setSeconds(0);

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {

        type: "audio",

        mimeType: "audio/wav",

        recorderType:
          RecordRTC.StereoAudioRecorder,

        numberOfAudioChannels: 1,

        desiredSampRate: 16000

      });

      recorderRef.current = recorder;

      recorder.startRecording();

      setRecording(true);

      timerRef.current = setInterval(() => {

        setSeconds(previous =>
          previous + 1
        );

      }, 1000);

    } catch (error) {

      console.error(
        "Microphone error:",
        error
      );

      setMessage(
        "❌ Microphone permission denied. Please allow microphone access."
      );

    }

  };


  // ==========================================
  // STOP RECORDING
  // ==========================================

  const stopRecording = () => {

    if (!recorderRef.current) {
      return;
    }

    recorderRef.current.stopRecording(
      async () => {

        const audioBlob =
          recorderRef.current.getBlob();

        setRecording(false);

        clearInterval(
          timerRef.current
        );


        // Stop microphone
        if (streamRef.current) {

          streamRef.current
            .getTracks()
            .forEach(track =>
              track.stop()
            );

        }


        // Minimum recording duration
        if (seconds < 2) {

          setMessage(
            "❌ Recording is too short. Please speak for at least 2 seconds."
          );

          return;
        }


        // Empty audio protection
        if (
          !audioBlob ||
          audioBlob.size < 1000
        ) {

          setMessage(
            "❌ No usable audio detected. Please speak clearly and try again."
          );

          return;
        }


        await saveVoice(audioBlob);

      }
    );

  };


  // ==========================================
  // CREATE OR UPDATE VOICE
  // ==========================================

  const saveVoice = async (audioBlob) => {

    try {

      setProcessing(true);

      setMessage(
        isUpdate
          ? "🤖 Updating your voice profile..."
          : "🤖 Creating your voice profile..."
      );


      const formData = new FormData();

      formData.append(
        "file",
        audioBlob,
        "voice-profile.wav"
      );


      let response;


      // UPDATE
      if (isUpdate) {

        response = await API.put(
          "/voice/update",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

      }

      // CREATE
      else {

        response = await API.post(
          "/voice/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

      }


      setMessage(
        response.data.message ||
        (
          isUpdate
            ? "Voice profile updated successfully."
            : "Voice profile created successfully."
        )
      );


    } catch (error) {

      console.error(
        "Voice profile error:",
        error
      );


      if (error.response) {

        setMessage(
          error.response.data?.detail ||
          error.response.data?.message ||
          "Voice profile operation failed."
        );

      } else {

        setMessage(
          "❌ Unable to connect to backend."
        );

      }

    } finally {

      setProcessing(false);

    }

  };


  // ==========================================
  // BACK TO DASHBOARD
  // ==========================================

  const handleBack = () => {

    navigate("/dashboard");

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="voice-register-page">


      {/* MAIN CONTENT */}

      <div className="voice-register-content">


        {/* BACK BUTTON */}

        <button
          type="button"
          className="voice-register-back-btn"
          onClick={handleBack}
        >
          ← Back to Dashboard
        </button>


        {/* HEADER */}

        <div className="voice-register-header">

          <div className="voice-icon">
            🎙️
          </div>


          <h1>

            {isUpdate
              ? "Update Voice Identity"
              : "Create Voice Identity"}

          </h1>


          <p>

            {isUpdate
              ? "Record a new voice sample to replace your existing biometric profile."
              : "Create your secure biometric voice profile for VoiceLock AI."}

          </p>

        </div>


        {/* RECORDING CARD */}

        <div className="voice-register-card">


          {/* START */}

          {!recording && !processing && (

            <div>

              <h2>

                {isUpdate
                  ? "🔄 Update Your Voice"
                  : "🎤 Create Your Voice Profile"}

              </h2>


              <p>
                Speak clearly for at least 2 seconds.
              </p>


              <button
                type="button"
                className="record-btn"
                onClick={startRecording}
              >
                🎙 Start Recording
              </button>

            </div>

          )}


          {/* RECORDING */}

          {recording && (

            <div className="recording-section">

              <div className="recording-icon">
                🔴
              </div>


              <h2>
                Recording Voice...
              </h2>


              <div className="recording-time">

                {Math.floor(seconds / 60)
                  .toString()
                  .padStart(2, "0")}

                :

                {(seconds % 60)
                  .toString()
                  .padStart(2, "0")}

              </div>


              <p>
                Speak clearly into your microphone.
              </p>


              <button
                type="button"
                className="stop-btn"
                onClick={stopRecording}
              >
                ⏹ Stop Recording
              </button>

            </div>

          )}


          {/* PROCESSING */}

          {processing && (

            <div className="processing-section">

              <div className="processing-icon">
                🤖
              </div>


              <h2>

                {isUpdate
                  ? "Updating Voice Profile..."
                  : "Creating Voice Profile..."}

              </h2>


              <p>
                AI is generating your voice fingerprint...
              </p>

            </div>

          )}


          {/* MESSAGE */}

          {message && !processing && (

            <div className="voice-message">

              {message}

            </div>

          )}

        </div>


        {/* VIEW PROFILE */}

        <button
          type="button"
          className="profile-btn"
          onClick={() =>
            navigate("/voice-profile")
          }
        >
          🎙 View Voice Profile
        </button>


      </div>

    </div>

  );

}

export default VoiceRegister;