import React, { useState } from 'react';
import axios from 'axios';
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom"


function CreatePost() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token');  
  const notify = (msg) => toast.success(msg,{autoClose:1500});
  const notifyerror = (msg) => toast.error(msg,{autoClose:2000});
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const [input, setInput] = useState({
    caption: "",
    file: null  
  });
  
  const handleImageChange = (event) => {
    setInput({
      ...input,
      file: event.target.files[0] 
    });
  };

  const handleCaptionChange = (event) => {
    setInput({
      ...input,
      caption: event.target.value  
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if(token===null) {
        
        notifyerror("Unauthorized User.")
        return
      }
      const formData = new FormData();
      formData.append('file', input.file);
      formData.append('caption', input.caption);

      const result = await axios.post("https://instagram-clone-fullstack.onrender.com/api/create-post", formData,config);
      if(result.data.msg==="Post created successfully."){
        notify(result.data.msg)
        navigate("/")

      } else{
        notifyerror(result.data.msg)
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post">
      <h2>Create Post</h2>
      <form>
        <div className="form-group">
          <label htmlFor="image">Select Image:</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="caption">Caption:</label>
          <textarea
            id="caption"
            value={input.caption}
            onChange={handleCaptionChange}
            rows={4}
            placeholder="Add a caption..."
          />
        </div>
        <button onClick={handleClick} type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
