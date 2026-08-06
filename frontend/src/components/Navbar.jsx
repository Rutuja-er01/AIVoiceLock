import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  return (

    <nav className="navbar">

      <div className="logo">
        🎙 VoiceLock AI
      </div>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/security">
          Security
        </Link>

        <Link to="/register">
          Register
        </Link>

        <Link to="/login">
          Login
        </Link>

      </div>

      <button className="theme-btn">
        🌙
      </button>

    </nav>

  );

}

export default Navbar;