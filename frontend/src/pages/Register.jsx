import { useState } from "react";
import API from "../api/axios";

function Register(){

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

        const response=await API.post(
            "user/register",
            user
        );

        alert("Registration Successful");

        console.log(response.data);

    }
    catch(error){

        console.log(error);
        alert("Registration Failed");

    }
};



return(
<div>

<h1>Create Account</h1>


<form onSubmit={handleRegister}>

<input
name="name"
placeholder="Name"
onChange={handleChange}
/>


<input
name="email"
placeholder="Email"
onChange={handleChange}
/>


<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>


<button>
Register
</button>


</form>


</div>
)

}

export default Register;