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


        console.log(response.data);

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


      <div className="dashboard-header">

        <h1>
          Welcome {profile?.name || "to VoiceLock AI"} 👋
        </h1>


        <p>
          Monitor voice authentication, security status and system activity in
          one place.
        </p>


        {
          profile && (
            <p>
              Logged in as: {profile.email}
            </p>
          )
        }

      </div>



      <div className="dashboard-cards">


        <div className="dashboard-card">
          <h2>🎙 Voice Profiles</h2>
          <h3>18</h3>
          <p>Registered Voice Samples</p>
        </div>


        <div className="dashboard-card">
          <h2>✅ Authentication</h2>
          <h3>Active</h3>
          <p>AI Verification Running</p>
        </div>


        <div className="dashboard-card">
          <h2>📊 Accuracy</h2>
          <h3>98.4%</h3>
          <p>Speaker Recognition Accuracy</p>
        </div>


        <div className="dashboard-card">
          <h2>🛡 Security</h2>
          <h3>Protected</h3>
          <p>JWT Authentication Enabled</p>
        </div>


      </div>




      <div className="recent-activity">

        <h2>Recent Activity</h2>


        <ul>

          <li>✅ User Registered Successfully</li>
          <li>🎤 Voice Sample Uploaded</li>
          <li>🤖 Whisper Speech Processing Completed</li>
          <li>🔐 Identity Verified Successfully</li>
          <li>📁 MongoDB Database Connected</li>

        </ul>


      </div>




      <div className="system-status">

        <h2>System Status</h2>

        <p>🟢 FastAPI Server : Online</p>
        <p>🟢 MongoDB : Connected</p>
        <p>🟢 AI Model : Ready</p>
        <p>🟢 Voice Authentication : Running</p>

      </div>



      {/* Voice Profile Button */}

      <button
        className="voice-btn"
        onClick={() => navigate("/voice-register")}
      >
        🎙 Create Voice Profile
      </button>



      {/* Logout Button */}

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