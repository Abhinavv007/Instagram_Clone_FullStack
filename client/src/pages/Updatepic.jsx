import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"

function Updatepic() {
  const navigate = useNavigate()
  const notifyerror = (msg) => toast.error(msg, { autoClose: 2000 });

  const notify = (msg) => toast.success(msg, { autoClose: 2000 });

  const token = localStorage.getItem("token");

  const [newPic, setNewPic] = useState(null);

  const handlePicChange = (event) => {
    setNewPic(event.target.files[0]);
  };

  const handlePicUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("pic", newPic);

      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };

     const result =  await axios.put("https://instagram-clone-fullstack.onrender.com/api/update-profile-pic", formData, config);
     if(result){
        notify(result.data.msg);
        navigate("/")
     } else{
        notifyerror(result.data.msg);


     }
     

    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <div className="update-pic-container">
      <h2 className="update-pic-title">Update Profile Picture</h2>
      <input type="file" accept="image/*" onChange={handlePicChange} className="pic-input" />
      <button onClick={handlePicUpload} className="upload-btn">Update</button>
    </div>
  );
}

export default Updatepic;
