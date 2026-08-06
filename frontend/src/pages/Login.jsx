import { useState } from "react";
import "./Login.css";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {

    e.preventDefault();


    try {

      const response = await API.post(
        "/login",
        {
          email: email,
          password: password
        }
      );


      console.log(response.data);


      if(response.data.access_token){

        // Save JWT token
        localStorage.setItem(
          "token",
          response.data.access_token
        );


        alert("Login Successful");


        // Go to dashboard
        navigate("/dashboard");

      }
      else{

        alert(response.data.message);

      }


    }
    catch(error){

      console.log(error);


      if(error.response){

        alert(
          error.response.data.message || 
          "Login Failed"
        );

      }
      else{

        alert("Backend server not connected");

      }

    }

  };


  return (

    <div className="login">

      <div className="login-box">

        <h1>Welcome Back 👋</h1>


        <p>
          Login to continue using VoiceLock AI.
        </p>


        <form onSubmit={handleLogin}>


          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />


          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />


          <button type="submit">
            Login
          </button>


        </form>


      </div>

    </div>

  );

}


export default Login;