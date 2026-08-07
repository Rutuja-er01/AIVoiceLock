import { useState } from "react";
import API from "../api/axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register(){
const navigate = useNavigate();

const [user,setUser]=useState({

name:"",
email:"",
password:""

});



const handleChange=(e)=>{

setUser({

...user,

[e.target.name]:e.target.value

});

};



const handleRegister=async(e)=>{

e.preventDefault();


try{


const response = await API.post(

"/user/register",

user

);


alert("Registration Successful");


console.log(response.data);
navigate("/login");


}


catch(error){


console.log(error);

alert("Registration Failed");


}


};



return(


<div className="register-page">


<div className="register-left">


<h1>
VoiceLock AI
</h1>


<h2>
Secure Your Identity With Your Voice
</h2>


<p>
Advanced AI powered voice authentication
system that protects your digital identity.
</p>



<div className="security-box">

🔒 Voice Biometrics
<br/>
🤖 AI Speaker Verification
<br/>
🛡 Secure Authentication

</div>


</div>




<div className="register-card">


<h1>
Create Account
</h1>


<p>
Join VoiceLock AI today
</p>



<form onSubmit={handleRegister}>


<input

type="text"

name="name"

placeholder="Full Name"

value={user.name}

onChange={handleChange}

/>



<input

type="email"

name="email"

placeholder="Email Address"

value={user.email}

onChange={handleChange}

/>



<input

type="password"

name="password"

placeholder="Password"

value={user.password}

onChange={handleChange}

/>



<button type="submit">

Register

</button>


</form>


</div>


</div>


);


}


export default Register;