import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import RecordRTC from "recordrtc";
import "./VoiceAuthenticate.css";


function VoiceAuthenticate() {


const navigate = useNavigate();


const recorderRef = useRef(null);
const streamRef = useRef(null);
const timerRef = useRef(null);


const [recording, setRecording] = useState(false);
const [seconds, setSeconds] = useState(0);
const [processing, setProcessing] = useState(false);
const [result, setResult] = useState("");



const startRecording = async () => {

try {

setResult("");

const stream = await navigator.mediaDevices.getUserMedia({
audio:true,
});


streamRef.current = stream;



const recorder = new RecordRTC(stream, {

type:"audio",

mimeType:"audio/wav",

recorderType:RecordRTC.StereoAudioRecorder,

numberOfAudioChannels:1,

desiredSampRate:16000,

});



recorderRef.current = recorder;


recorder.startRecording();


setRecording(true);

setSeconds(0);



timerRef.current = setInterval(()=>{

setSeconds(previous=>previous+1);

},1000);



}

catch(error){

console.error("Microphone error:",error);

setResult(
"Microphone permission denied."
);

}

};





const stopRecording = () => {


if(!recorderRef.current)
return;



recorderRef.current.stopRecording(async()=>{


const audioBlob = recorderRef.current.getBlob();


setRecording(false);


clearInterval(timerRef.current);



if(streamRef.current){

streamRef.current
.getTracks()
.forEach(track=>track.stop());

}



await authenticateVoice(audioBlob);



});


};





const authenticateVoice = async(audioBlob)=>{


try{


setProcessing(true);

setResult(
"🤖 Verifying your voice..."
);



const formData = new FormData();



formData.append(

"file",

audioBlob,

"voice-authentication.wav"

);



const response = await API.post(

"/voice/verify",

formData,

{

headers:{

"Content-Type":"multipart/form-data"

}

}

);



console.log(response.data);



setResult(
JSON.stringify(response.data)
);



}

catch(error){


console.error("Authentication error:",error);



if(error.response){

setResult(

error.response.data?.detail ||

"Voice authentication failed."

);

}

else{

setResult(
"Unable to connect to backend."
);

}


}

finally{

setProcessing(false);

}


};





return(


<div className="voice-profile-page">



<button

className="back-btn"

onClick={()=>navigate("/dashboard")}

>

← Dashboard

</button>





<h1>
🔐 Voice Authentication
</h1>



<p>
Verify your identity using your registered voice.
</p>





<div className="info-card">


<h2>
How Authentication Works
</h2>


<p>
🎙 Record your voice sample
</p>


<p>
🤖 AI compares your voice pattern
</p>


<p>
✅ Access is granted after verification
</p>


</div>






{!recording && !processing && (


<button

onClick={startRecording}

className="record-btn"

>

🎙 Start Authentication


</button>


)}






{recording && (


<div className="recording-box">


<h2>
🔴 Recording...
</h2>



<p>

Recording Time:

{" "}

{Math.floor(seconds/60)
.toString()
.padStart(2,"0")}

:

{(seconds%60)
.toString()
.padStart(2,"0")}


</p>



<button

onClick={stopRecording}

className="stop-btn"

>

⏹ Stop Recording


</button>



</div>


)}







{processing && (

<h2>
🤖 Processing Voice...
</h2>

)}






{result && !processing && (


<div className="result-box">


<h3>
Authentication Result
</h3>


<p>
{result}
</p>


</div>


)}



</div>


);


}


export default VoiceAuthenticate;