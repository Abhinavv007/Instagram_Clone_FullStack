import axios from 'axios';
import React,{useState} from 'react';
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";


function Login() {


  const notify = (msg) => toast.success(msg,{autoClose:1500});
  const notifyerror = (msg) => toast.error(msg,{autoClose:2000});
  const [input,setInput] = useState({
    email:"",
    password:""
  })
  const handleLogIn = async(e)=>{
    e.preventDefault()
    const result = await axios.post("https://instagram-clone-fullstack.onrender.com/api/login",input)
    if(result.data.msg==="Logged In Successfully."){
      notify(result.data.msg)
      localStorage.setItem("token",result.data.token)
      localStorage.setItem("name",result.data.name)
      localStorage.setItem("id",result.data.id)
    
      navigate("/create-post");
    } else{
      notifyerror(result.data.msg)
     }

  }
  const navigate = useNavigate()
  return (
    <div className="app">
      <div className="left">
        <img src="logo2.png" alt="logo2" />
      </div>
      <div className="right">
        <img src="logo.png" alt="logo" />
        <input onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})} value={input.email} name="email" placeholder="Email" className='inputs' type="text"  />
        <input onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})} value={input.password} name="password" placeholder="Password" className='inputs' type="password"  />
        <button onClick={handleLogIn} className="btn">Log in</button>
        <div className="ptags">
          <p className="rest"> Don't have an account?</p>
          <p onClick={()=>navigate("/signup")}  className="rest signup">Sign up</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
