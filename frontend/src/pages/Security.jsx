import "./Security.css";

function Security() {
  return (
    <div className="security">

      <div className="security-header">
        <h1>Security Center 🔐</h1>
        <p>
          VoiceLock AI uses advanced AI and voice biometrics to protect user identities.
        </p>
      </div>

      <div className="security-cards">

        <div className="security-card">
          <h2>🎙 Voice Biometrics</h2>
          <p>
            Every user's unique voice pattern is analyzed for secure authentication.
          </p>
        </div>

        <div className="security-card">
          <h2>🤖 Whisper AI</h2>
          <p>
            OpenAI Whisper converts speech into text with high accuracy.
          </p>
        </div>

        <div className="security-card">
          <h2>🔐 JWT Authentication</h2>
          <p>
            Secure login sessions are managed using JSON Web Tokens.
          </p>
        </div>

        <div className="security-card">
          <h2>💾 MongoDB</h2>
          <p>
            User information and voice profiles are securely stored.
          </p>
        </div>

        <div className="security-card">
          <h2>🛡 AI Verification</h2>
          <p>
            Machine Learning verifies voice identity before granting access.
          </p>
        </div>

        <div className="security-card">
          <h2>⚡ FastAPI Backend</h2>
          <p>
            High-performance backend ensures secure and fast processing.
          </p>
        </div>

      </div>

      <div className="process">

        <h2>Authentication Process</h2>

        <div className="steps">
          <p>🎤 Speak Passphrase</p>
          <p>⬇</p>
          <p>🤖 Whisper Speech Recognition</p>
          <p>⬇</p>
          <p>🎙 Voice Feature Extraction</p>
          <p>⬇</p>
          <p>🧠 AI Verification</p>
          <p>⬇</p>
          <p>✅ Access Granted</p>
        </div>

      </div>

    </div>
  );
}

export default Security;