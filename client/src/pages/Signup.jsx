import React, { useState } from 'react';
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
function Signup() {

  const navigate = useNavigate()
  const notify = (msg) => toast.success(msg, { autoClose: 2000 });
  const notifyerror = (msg) => toast.error(msg, { autoClose: 2000 });

  const [input, setInput] = useState({
    email: "",
    Fname: "",
    username: "",
    password: "",
    pic: ""
  })
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("Fname", input.Fname);
      formData.append("username", input.username);
      formData.append("password", input.password);
      formData.append("pic", input.pic);
  
      const signup = await axios.post("https://instagram-clone-fullstack.onrender.com/api/signup", formData);
      if (signup.data.msg === "SignUp Successfully Done.") {
        notify(signup.data.msg);
        const  pic  = input.pic; 
        navigate("/login")
        
      } else {

        notifyerror(signup.data.msg);
      }
    } catch (error) {
      console.error("Some error", error);
    }
  };
  
  
  return (
    <div className='signup-container'>
      <div className="signup-form">
        <img src="logo.png" alt="logo" className="logo" />
        <h4 className="signup-heading">Sign up to see photos and videos</h4>
        <input value={input.email} onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })} name='email' placeholder='Email address' className='input' type="text" />
        <input value={input.Fname} onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })} name='Fname' placeholder='Fullname' className='input' type="text" />
        <input value={input.username} onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })} name='username' placeholder='Username' className='input' type="text" />
        <input value={input.password} onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })} name='password' placeholder='Password' className='input' type="password" />
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload Profile Picture
        </label>
        <input
          id="file-upload"
          onChange={(e) => setInput({ ...input,[e.target.name]: e.target.files[0] })}
          name="pic"
          type="file"
          className="input"
          style={{ display: 'none' }}
        />




      </div>

      <div className="terms">
        <p className="terms-text">By signing up, you agree to our Terms, Privacy </p>
        <p className="terms-text">Policy and Cookies Policy.</p>
      </div>

      <button onClick={handleSignUp} className='signup-btn'>Sign Up</button>
    </div>
  );
}

export default Signup;
