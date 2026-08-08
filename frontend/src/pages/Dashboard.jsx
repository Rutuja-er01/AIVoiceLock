import { useEffect, useState } from "react";
import "./Dashboard.css";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        // Get user profile
        const profileResponse = await API.get("/profile");

        setProfile(profileResponse.data.user);

        // Get dashboard statistics
        const dashboardResponse = await API.get("/dashboard");

        setDashboard(dashboardResponse.data);

        // Get authentication history
        const historyResponse = await API.get("/voice/history");

        // Show newest records first
        const sortedHistory = [...historyResponse.data].reverse();

        setHistory(sortedHistory);

      } catch (error) {
        console.log("Dashboard error:", error);

        localStorage.removeItem("token");

        alert("Session expired. Please login again");

        navigate("/login");

      } finally {
        setLoading(false);
      }
    };

    getDashboardData();

  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  // Calculate accuracy
  const accuracy =
    dashboard && dashboard.total_verifications > 0
      ? (
          (dashboard.successful_verifications /
            dashboard.total_verifications) *
          100
        ).toFixed(1)
      : "0.0";


  // Format date
  const formatDate = (date) => {

    if (!date) {
      return "Unknown time";
    }

    try {

      return new Date(date).toLocaleString();

    } catch {

      return "Unknown time";

    }

  };


  if (loading) {

    return (
      <div className="dashboard">

        <div className="dashboard-header">

          <h1>
            Loading Dashboard...
          </h1>

          <p>
            Fetching your security information.
          </p>

        </div>

      </div>
    );

  }


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

        {profile && (

          <div className="profile-info">

            Logged in as:
            <strong> {profile.email}</strong>

          </div>

        )}

      </div>



      {/* Dashboard Cards */}

      <div className="dashboard-cards">


        {/* Voice Profiles */}

        <div className="dashboard-card">

          <span className="card-icon">
            🎙️
          </span>

          <h2>
            Voice Profiles
          </h2>

          <h3>
            {dashboard?.total_voice_samples ?? 0}
          </h3>

          <p>
            Registered Voice Samples
          </p>

        </div>



        {/* Authentication */}

        <div className="dashboard-card">

          <span className="card-icon">
            ✅
          </span>

          <h2>
            Authentication
          </h2>

          <h3>
            {dashboard?.system_status === "Running"
              ? "Active"
              : "Offline"}
          </h3>

          <p>
            AI Verification Running
          </p>

        </div>



        {/* Accuracy */}

        <div className="dashboard-card">

          <span className="card-icon">
            📊
          </span>

          <h2>
            Accuracy
          </h2>

          <h3>
            {accuracy}%
          </h3>

          <p>
            Based on authentication history
          </p>

        </div>



        {/* Security */}

        <div className="dashboard-card">

          <span className="card-icon">
            🛡️
          </span>

          <h2>
            Security
          </h2>

          <h3>
            {profile ? "Protected" : "Unknown"}
          </h3>

          <p>
            JWT Authentication Enabled
          </p>

        </div>

      </div>



      {/* Authentication Statistics */}

      <div className="dashboard-section">

        <h2>
          Authentication Statistics
        </h2>

        <div className="status-grid">

          <p>
            👥 Registered Users:
            <strong>
              {" "}
              {dashboard?.total_users ?? 0}
            </strong>
          </p>

          <p>
            🎙️ Voice Samples:
            <strong>
              {" "}
              {dashboard?.total_voice_samples ?? 0}
            </strong>
          </p>

          <p>
            🔐 Total Verifications:
            <strong>
              {" "}
              {dashboard?.total_verifications ?? 0}
            </strong>
          </p>

          <p>
            ✅ Successful:
            <strong>
              {" "}
              {dashboard?.successful_verifications ?? 0}
            </strong>
          </p>

          <p>
            ❌ Failed:
            <strong>
              {" "}
              {dashboard?.failed_verifications ?? 0}
            </strong>
          </p>

        </div>

      </div>



      {/* REAL Recent Activity */}

      <div className="dashboard-section">

        <h2>
          Recent Authentication Activity
        </h2>


        {history.length === 0 ? (

          <div className="activity-list">

            <p>
              📭 No authentication activity yet.
            </p>

          </div>

        ) : (

          <div className="activity-list">

            {history.slice(0, 10).map((item, index) => (

              <p key={index}>

                {item.status === "Access Granted"
                  ? "✅"
                  : "❌"}

                {" "}

                <strong>
                  {item.status}
                </strong>

                {" — "}

                {item.email || item.speaker}

                {" — "}

                {formatDate(item.timestamp)}

              </p>

            ))}

          </div>

        )}

      </div>



      {/* System Status */}

      <div className="dashboard-section">

        <h2>
          System Status
        </h2>

        <div className="status-grid">

          <p>
            🟢 FastAPI Server : Online
          </p>

          <p>
            🟢 MongoDB : Connected
          </p>

          <p>
            🟢 AI Model : Ready
          </p>

          <p>
            🟢 Voice Authentication : Running
          </p>

        </div>

      </div>



      {/* Actions */}

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



      {/* Logout */}

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