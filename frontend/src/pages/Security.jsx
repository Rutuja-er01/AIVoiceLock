import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Security.css";

function Security() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [voiceProfile, setVoiceProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        // Get logged-in user
        const profileResponse = await API.get("/profile");

        setProfile(profileResponse.data.user);


        // Get user's actual voice profile
        const voiceResponse = await API.get("/voice/my-voice");

        if (voiceResponse.data?.email) {
          setVoiceProfile(voiceResponse.data);
        } else {
          setVoiceProfile(null);
        }


        // Get backend/dashboard status
        const dashboardResponse = await API.get("/dashboard");

        setDashboard(dashboardResponse.data);

      } catch (error) {
        console.error("Security Center error:", error);

        localStorage.removeItem("token");

        alert("Your session has expired. Please login again.");

        navigate("/login");

      } finally {
        setLoading(false);
      }
    };

    loadSecurityData();

  }, [navigate]);


  if (loading) {
    return (
      <div className="security-page">

        <div className="security-header">

          <h1>
            Security Center 🔐
          </h1>

          <p>
            Checking your security status...
          </p>

        </div>

      </div>
    );
  }


  const jwtProtected = profile !== null;

  const voiceProtected = voiceProfile !== null;

  const backendRunning =
    dashboard?.system_status === "Running";


  return (

    <div className="security-page">

      {/* Header */}

      <div className="security-header">

        <h1>
          Security Center 🔐
        </h1>

        <p>
          Real-time security status of your VoiceLock AI account.
        </p>

      </div>



      {/* Security Cards */}

      <div className="security-cards">


        {/* Voice Biometrics */}

        <div className="security-card">

          <h2>
            🎙 Voice Biometrics
          </h2>

          <div className="security-status">

            {voiceProtected ? (
              <>
                <span className="status-active">
                  🟢 Active
                </span>

                <p>
                  Voice profile is enrolled and ready for authentication.
                </p>
              </>
            ) : (
              <>
                <span className="status-warning">
                  🟠 Not Enrolled
                </span>

                <p>
                  No voice profile is registered for your account.
                </p>

                <button
                  className="security-action"
                  onClick={() => navigate("/voice-register")}
                >
                  🎙 Create Voice Profile
                </button>
              </>
            )}

          </div>

        </div>



        {/* Whisper AI */}

        <div className="security-card">

          <h2>
            🤖 Whisper AI
          </h2>

          <div className="security-status">

            <span className="status-active">
              🟢 Configured
            </span>

            <p>
              Speech processing is configured in the VoiceLock AI backend.
            </p>

          </div>

        </div>



        {/* JWT Authentication */}

        <div className="security-card">

          <h2>
            🔐 JWT Authentication
          </h2>

          <div className="security-status">

            {jwtProtected ? (
              <>
                <span className="status-active">
                  🟢 Protected
                </span>

                <p>
                  Your current session is authenticated using JWT.
                </p>
              </>
            ) : (
              <>
                <span className="status-warning">
                  🔴 Not Protected
                </span>

                <p>
                  No valid login session was found.
                </p>
              </>
            )}

          </div>

        </div>



        {/* MongoDB */}

        <div className="security-card">

          <h2>
            💾 MongoDB
          </h2>

          <div className="security-status">

            {dashboard ? (
              <>
                <span className="status-active">
                  🟢 Connected
                </span>

                <p>
                  The backend successfully retrieved your database statistics.
                </p>
              </>
            ) : (
              <>
                <span className="status-warning">
                  🔴 Unavailable
                </span>

                <p>
                  Database information could not be retrieved.
                </p>
              </>
            )}

          </div>

        </div>



        {/* AI Verification */}

        <div className="security-card">

          <h2>
            🛡 AI Verification
          </h2>

          <div className="security-status">

            {voiceProtected ? (
              <>
                <span className="status-active">
                  🟢 Ready
                </span>

                <p>
                  Your registered voice can be used for identity verification.
                </p>

                <button
                  className="security-action"
                  onClick={() => navigate("/voice-auth")}
                >
                  🔐 Test Voice Authentication
                </button>
              </>
            ) : (
              <>
                <span className="status-warning">
                  🟠 Waiting
                </span>

                <p>
                  Create a voice profile before verification can be performed.
                </p>
              </>
            )}

          </div>

        </div>



        {/* FastAPI */}

        <div className="security-card">

          <h2>
            ⚡ FastAPI Backend
          </h2>

          <div className="security-status">

            {backendRunning ? (
              <>
                <span className="status-active">
                  🟢 Online
                </span>

                <p>
                  FastAPI backend is responding successfully.
                </p>
              </>
            ) : (
              <>
                <span className="status-warning">
                  🔴 Offline
                </span>

                <p>
                  Backend is not responding correctly.
                </p>
              </>
            )}

          </div>

        </div>


      </div>



      {/* Security Summary */}

      <div className="process">

        <h2>
          Current Security Status
        </h2>

        <div className="steps">

          <p>
            {jwtProtected
              ? "✅ JWT Session: Protected"
              : "❌ JWT Session: Not Protected"}
          </p>

          <p>
            ↓
          </p>

          <p>
            {voiceProtected
              ? "✅ Voice Profile: Enrolled"
              : "⚠️ Voice Profile: Not Enrolled"}
          </p>

          <p>
            ↓
          </p>

          <p>
            {backendRunning
              ? "✅ FastAPI Backend: Online"
              : "❌ FastAPI Backend: Offline"}
          </p>

          <p>
            ↓
          </p>

          <p>
            {voiceProtected
              ? "✅ AI Voice Verification: Ready"
              : "⚠️ AI Voice Verification: Waiting for Voice Profile"}
          </p>

        </div>

      </div>



      {/* Navigation */}

      <div className="security-actions">

        <button
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        {voiceProtected && (
          <button
            onClick={() => navigate("/voice-auth")}
          >
            🔐 Authenticate Voice
          </button>
        )}

      </div>

    </div>

  );
}

export default Security;