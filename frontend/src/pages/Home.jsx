import "./Home.css";

function Home() {

return (

<div className="home">


<section className="hero">

<div className="hero-text">

<h1>
AI VoiceLock
</h1>

<h2>
Your Voice is Your Password
</h2>


<p>
Secure authentication system using 
Artificial Intelligence and Voice Recognition.
</p>


<div className="buttons">

<button>
Get Started
</button>


<button className="secondary">
Learn More
</button>

</div>


</div>



<div className="hero-image">

<img 
src="https://cdn-icons-png.flaticon.com/512/2956/2956744.png"
alt="voice"
/>

</div>


</section>



<section className="features">


<h1>
Powerful Features
</h1>


<div className="cards">


<div className="card">

<h2>🎙 Voice Recognition</h2>

<p>
AI identifies users through unique voice patterns.
</p>

</div>



<div className="card">

<h2>🔐 Secure Login</h2>

<p>
Multi-factor authentication for better security.
</p>

</div>




<div className="card">

<h2>🤖 AI Powered</h2>

<p>
Machine learning models verify identity.
</p>

</div>



</div>


</section>




<section className="working">

<h1>
How It Works
</h1>


<p>
1. User speaks passphrase
</p>

<p>
⬇
</p>

<p>
2. AI extracts voice features
</p>

<p>
⬇
</p>

<p>
3. System verifies identity
</p>

<p>
⬇
</p>

<p>
4. Access granted
</p>


</section>



</div>

);

}


export default Home;