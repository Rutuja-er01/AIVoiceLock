import { useState } from "react";
import API from "../api/axios";


function VoiceRegister(){

    const [audio,setAudio] = useState(null);
    const [passphrase,setPassphrase] = useState("");
    const [message,setMessage] = useState("");


    const handleFileChange = (e)=>{
        setAudio(e.target.files[0]);
    };


    const registerVoice = async()=>{


        if(!audio || !passphrase){

            alert("Please enter passphrase and select voice sample");
            return;

        }


        try{


            const formData = new FormData();


            formData.append(
                "username",
                "logged_user"
            );


            formData.append(
                "passphrase",
                passphrase
            );


            formData.append(
                "audio",
                audio
            );


            const response = await API.post(
                "/register",
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );


            setMessage(response.data.message);


        }
        catch(error){

            console.log(error);

            setMessage("Voice registration failed");

        }


    };



    return(

        <div>

            <h1>🎙 Voice Enrollment</h1>


            <p>
                Create your voice password profile.
            </p>



            <input
                type="text"
                placeholder="Enter voice passphrase"
                value={passphrase}
                onChange={(e)=>setPassphrase(e.target.value)}
            />


            <br/><br/>


            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
            />


            <br/><br/>


            <button onClick={registerVoice}>
                Save Voice Profile
            </button>


            <h3>
                {message}
            </h3>


        </div>

    );

}


export default VoiceRegister;