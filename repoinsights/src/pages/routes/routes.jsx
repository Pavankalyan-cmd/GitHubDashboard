import { Routes, Route } from "react-router-dom"; 
import Dashboard from "../Dashboard/dashboard";
import Landingpage from "../Landingpage/landingpage";
import Callbackk from "../Callback/TokenExchange";
import { ToastContainer } from "react-toastify";
export default function Routess(){ 
    return( 
    <div> 
        <ToastContainer/>
        <Routes> 
            <Route path="/" element={<Landingpage/>}> </Route> 
            <Route path="/dashboard" element={<Dashboard/>}></Route> 
            <Route path="/callback" element={<Callbackk/>}></Route> 
        </Routes> 
    </div>
     ) 
}