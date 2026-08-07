import { useEffect, useState } from "react";
import "./Dashboard.css";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {

    const getProfile = async () => {

      try {

        const token = localStorage.getItem("token");


        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }


        const response = await API.get(
          "/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        setProfile(response.data.user);


      }
      catch(error){

        console.log(error);

        alert("Session expired. Please login again");

        localStorage.removeItem("token");

        navigate("/login");

      }

    };


    getProfile();

  }, [navigate]);



  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };



  return (

    <div className="dashboard">


      {/* Header */}

      <div className="dashboard-header">

        <h1>
          Welcome {profile?.name || "to VoiceLock AI"} 👋
        </h1>


        <p>
          AI powered voice authentication and security monitoring dashboard.
        </p>


        {
          profile && (
            <div className="profile-info">
              Logged in as:
              <strong> {profile.email}</strong>
            </div>
          )
        }

      </div>



      {/* Dashboard Cards */}

      <div className="dashboard-cards">


        <div className="dashboard-card">

          <span className="card-icon">
            🎙️
          </span>

          <h2>
            Voice Profiles
          </h2>

          <h3>
            18
          </h3>

          <p>
            Registered Voice Samples
          </p>

        </div>



        <div className="dashboard-card">

          <span className="card-icon">
            ✅
          </span>

          <h2>
            Authentication
          </h2>

          <h3>
            Active
          </h3>

          <p>
            AI Verification Running
          </p>

        </div>



        <div className="dashboard-card">

          <span className="card-icon">
            📊
          </span>

          <h2>
            Accuracy
          </h2>

          <h3>
            98.4%
          </h3>

          <p>
            Speaker Recognition Accuracy
          </p>

        </div>



        <div className="dashboard-card">

          <span className="card-icon">
            🛡️
          </span>

          <h2>
            Security
          </h2>

          <h3>
            Protected
          </h3>

          <p>
            JWT Authentication Enabled
          </p>

        </div>


      </div>




      {/* Activity Section */}

      <div className="dashboard-section">

        <h2>
          Recent Activity
        </h2>


        <div className="activity-list">

          <p>✅ User Registered Successfully</p>

          <p>🎤 Voice Profile Created</p>

          <p>🤖 Whisper Speech Processing Completed</p>

          <p>🔐 Identity Verified Successfully</p>

          <p>📁 MongoDB Database Connected</p>

        </div>


      </div>





      {/* System Status */}

      <div className="dashboard-section">


        <h2>
          System Status
        </h2>


        <div className="status-grid">

          <p>🟢 FastAPI Server : Online</p>

          <p>🟢 MongoDB : Connected</p>

          <p>🟢 AI Model : Ready</p>

          <p>🟢 Voice Authentication : Running</p>


        </div>


      </div>




      {/* Action Buttons */}

      <div className="voice-actions">


        <button
          className="voice-btn"
          onClick={() => navigate("/voice-register")}
        >

          🎙 Create Voice Profile

        </button>



        <button
          className="voice-btn"
          onClick={() => navigate("/voice-auth")}
        >

          🔐 Authenticate Voice

        </button>


      </div>



      <button
        className="logout-btn"
        onClick={handleLogout}
      >

        Logout

      </button>



    </div>

  );

}


export default Dashboard;