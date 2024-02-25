import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"

function Profile() {
  const navigate = useNavigate()
 
  const [myposts, setMyPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [pic,setPic] = useState("")
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {

    const fetchData = async () => {
      try {

        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };
        const response = await axios.get("https://instagram-clone-fullstack.onrender.com/api/mypost", config);
        const getPic = await axios.get("https://instagram-clone-fullstack.onrender.com/api/profile-pic", config);
        setPic(getPic.data.msg)
        setMyPosts(response.data.msg);
        setUsername(response.data.msg[0]?.postedBy?.Fname);
        setFollowersCount(response.data.msg[0]?.postedBy?.followers.length);
        setFollowingCount(response.data.msg[0]?.postedBy?.following.length);
       
        
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="profile-page">
        <div className="profile-header">
          <img onClick={()=>navigate("/update-pic")} src={`https://instagram-clone-fullstack.onrender.com/${pic}`} alt="Profile" className="profile-pic2" />
        </div>
        <div className="stats">
          <div className="username1">
            <h2 style={{ marginLeft: 10 }} className="username2">{username}</h2>
            <span className='spans'>{myposts.length} posts</span>
            <span className='spans'>{followersCount} followers</span>
            <span className='spans'>{followingCount} following</span>
          </div>
        </div>
      </div>
      <h4 style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:6,fontFamily:"sans-serif",fontWeight:"lighter"}}>Your Posts</h4>
    
      <div className="posts">
        <div className="post-image-container">
          {myposts.map(post => (
            <img key={post._id} src={`https://instagram-clone-fullstack.onrender.com/${post.file}`} alt={post.caption} className="post-pic" />
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
