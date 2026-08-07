import "./About.css";
import BackButton from "../components/BackButton";


function About(){


return(


<div className="about">


<BackButton />


<h1>
About VoiceLock AI
</h1>



<p>
VoiceLock AI is an Artificial Intelligence based
voice authentication system that uses voice recognition
and machine learning to verify user identity securely.
</p>



<div className="about-box">


<h2>
How VoiceLock AI Works
</h2>


<p>
🎙 User records voice passphrase
</p>


<p>
🤖 AI extracts voice features
</p>


<p>
🔐 System compares voice pattern
</p>


<p>
✅ Access is granted after verification
</p>


</div>



</div>


)


}


export default About;