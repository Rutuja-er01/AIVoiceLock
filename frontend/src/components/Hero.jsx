import { Link } from "react-router-dom";
import "./Hero.css";


function Hero(){

    return(

        <section className="hero">


            <div className="hero-content">


                <h1>
                    Your Voice Is Your Identity
                </h1>


                <h2>
                    AI Powered Voice Authentication
                </h2>


                <p>
                    VoiceLock AI provides secure authentication
                    using advanced voice biometrics and artificial
                    intelligence technology.
                </p>



                <div className="hero-buttons">


                    <Link to="/register">

                        <button className="primary-btn">
                            Get Started
                        </button>

                    </Link>



                    <a href="#features">

                        <button className="secondary-btn">
                            Read More
                        </button>

                    </a>


                </div>



            </div>




            <div className="hero-image">


                <div className="voice-card">

                    🎙️

                    <h3>
                        Voice Biometrics
                    </h3>

                    <p>
                        Secure. Fast. Intelligent.
                    </p>


                </div>


            </div>



        </section>


    );

}


export default Hero;