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

function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>}/>

<Route path="/register" element={<Register/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/security" element={<Security />} />
<Route path="/login" element={<Login />} />
<Route
 path="/voice-register"
 element={<VoiceRegister />}
/>


</Routes>


</BrowserRouter>

)

}


export default App;