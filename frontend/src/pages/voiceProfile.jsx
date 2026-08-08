import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./VoiceProfile.css";

function VoiceProfile() {

  const navigate = useNavigate();

  const [voice, setVoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");


  // ==========================================
  // GET VOICE PROFILE
  // ==========================================

  useEffect(() => {

    const getVoiceProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {

          alert("Please login first");

          navigate("/login");

          return;

        }


        const response = await API.get(
          "/voice/my-voice"
        );


        if (response.data?.email) {

          setVoice(response.data);

        } else {

          setVoice(null);

        }


      } catch (error) {

        console.error(
          "Voice profile error:",
          error
        );


        if (error.response?.status === 401) {

          localStorage.removeItem("token");

          alert(
            "Session expired. Please login again"
          );

          navigate("/login");

        } else {

          setMessage(
            "Unable to load voice profile."
          );

        }

      } finally {

        setLoading(false);

      }

    };


    getVoiceProfile();

  }, [navigate]);


  // ==========================================
  // DELETE VOICE
  // ==========================================

  const deleteVoiceProfile = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete your voice profile?"
    );


    if (!confirmed) {

      return;

    }


    try {

      setDeleting(true);


      const response = await API.delete(
        "/voice/delete"
      );


      setVoice(null);


      setMessage(
        response.data.message ||
        "Voice profile deleted successfully."
      );


    } catch (error) {

      console.error(error);


      setMessage(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to delete voice profile."
      );


    } finally {

      setDeleting(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="voice-profile-page">

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>


        <div className="voice-profile-header">

          <h1>
            🎙 Voice Profile
          </h1>

          <p>
            Loading your voice profile...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="voice-profile-page">


      {/* ======================================
          BACK TO DASHBOARD
      ====================================== */}

      <div className="profile-back-container">

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="voice-profile-header">

        <h1>
          🎙 Voice Profile
        </h1>

        <p>
          Manage your VoiceLock AI biometric identity.
        </p>

      </div>


      {/* ======================================
          EXISTING VOICE
      ====================================== */}

      {voice ? (

        <div className="voice-profile-card">


          <div className="voice-profile-icon">
            🎙️
          </div>


          <h2>
            Voice Identity Active
          </h2>


          <div className="voice-status">
            🟢 Active
          </div>


          {/* DETAILS */}

          <div className="voice-details">


            <div>

              <span>
                Account
              </span>

              <strong>
                {voice.email}
              </strong>

            </div>


            <div>

              <span>
                Audio File
              </span>

              <strong>
                {voice.filename}
              </strong>

            </div>


            <div>

              <span>
                Created
              </span>

              <strong>

                {voice.uploaded_at
                  ? new Date(
                      voice.uploaded_at
                    ).toLocaleString()
                  : "Unknown"}

              </strong>

            </div>


            <div>

              <span>
                Authentication
              </span>

              <strong>
                Ready
              </strong>

            </div>


          </div>


          {/* ACTION BUTTONS */}

          <div className="voice-profile-actions">


            <button
              className="update-voice-btn"
              onClick={() =>
                navigate(
                  "/voice-register",
                  {
                    state: {
                      update: true
                    }
                  }
                )
              }
            >
              🔄 Update Voice
            </button>


            <button
              className="delete-voice-btn"
              onClick={deleteVoiceProfile}
              disabled={deleting}
            >

              {deleting
                ? "Deleting..."
                : "🗑 Delete Voice"}

            </button>


            <button
              className="authenticate-voice-btn"
              onClick={() =>
                navigate("/voice-auth")
              }
            >
              🔐 Authenticate
            </button>


          </div>


        </div>


      ) : (


        /* ====================================
           NO VOICE
        ==================================== */

        <div className="no-voice-card">


          <div className="voice-profile-icon">
            🎙️
          </div>


          <h2>
            No Voice Profile
          </h2>


          <p>
            You haven't created a voice identity yet.
          </p>


          <button
            className="update-voice-btn"
            onClick={() =>
              navigate("/voice-register")
            }
          >
            🎙 Create Voice Profile
          </button>


        </div>

      )}


      {/* MESSAGE */}

      {message && (

        <div className="voice-profile-message">
          {message}
        </div>

      )}


    </div>

  );

}


export default VoiceProfile;