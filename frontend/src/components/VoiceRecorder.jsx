import { useRef, useState } from "react";
import RecordRTC from "recordrtc";

function VoiceRecorder() {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
      });

      recorderRef.current = recorder;

      recorder.startRecording();

      setRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Microphone error:", error);
      alert("Microphone permission is required.");
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const audioBlob = recorderRef.current.getBlob();

      console.log("Recording completed:", audioBlob);

      setRecording(false);

      clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    });
  };

  return (
    <div className="voice-recorder">

      <h2>🎙️ Voice Authentication</h2>

      <p>
        Record your voice to verify your identity.
      </p>

      {!recording ? (
        <button
          className="record-btn"
          onClick={startRecording}
        >
          🎙️ Start Recording
        </button>
      ) : (
        <>
          <div className="recording-status">
            🔴 Recording...
          </div>

          <div className="recording-time">
            00:{seconds.toString().padStart(2, "0")}
          </div>

          <button
            className="stop-btn"
            onClick={stopRecording}
          >
            ⏹ Stop Recording
          </button>
        </>
      )}

    </div>
  );
}

export default VoiceRecorder;