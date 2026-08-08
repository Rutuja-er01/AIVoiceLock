import Navbar from "./components/Navbar";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Security from "./pages/Security";
import Login from "./pages/Login";
import VoiceRegister from "./pages/VoiceRegister";
import VoiceAuthenticate from "./pages/VoiceAuthenticate";
import VoiceProfile from "./pages/VoiceProfile";
import About from "./pages/About";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* User Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Security */}
        <Route
          path="/security"
          element={<Security />}
        />

        {/* Voice Registration */}
        <Route
          path="/voice-register"
          element={<VoiceRegister />}
        />

        {/* Voice Profile */}
        <Route
          path="/voice-profile"
          element={<VoiceProfile />}
        />

        {/* Voice Authentication */}
        <Route
          path="/voice-auth"
          element={<VoiceAuthenticate />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;