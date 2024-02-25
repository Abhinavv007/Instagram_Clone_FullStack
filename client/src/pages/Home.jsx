  import React, { useEffect, useState } from 'react';
  import axios from "axios";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import {useNavigate} from "react-router-dom"

  function NoPostsMessage() {
    return (
      <div className="no-posts-message">
        <h2>Create your first post!</h2>
      </div>
    );
  }

  function Home() {
    const navigate = useNavigate()
    const currentUser = localStorage.getItem("name");

    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState("");

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };

    const notify = (message) => toast.success(message, { autoClose: 1000 });

    const fetchData = async () => {
      try {
        const response = await axios.get("https://instagram-clone-fullstack.onrender.com/api/posts", config);
        setPosts(response.data.msg);

      } catch (error) {
        console.error("Error fetching posts:", error);
        
      }
    };

    const handleUnLike = async (id) => {
      await axios.put(`https://instagram-clone-fullstack.onrender.com/api/unlike/${id}`, null, config);
      fetchData();
      notify("Unliked👎");
    };

    const handleDelete = async (id) => {
      const result = await axios.delete(`https://instagram-clone-fullstack.onrender.com/api/delete/${id}`, config);
      notify(result.data.msg);
      fetchData();
    };

    const handleLike = async (id) => {
      await axios.put(`https://instagram-clone-fullstack.onrender.com/api/like/${id}`, null, config);
      fetchData();
      notify("Liked👍");
    };

    const handleComment = async (id) => {
      try {
        await axios.put(`https://instagram-clone-fullstack.onrender.com/api/comment/${id}`, { text: commentText }, config);
        fetchData();
        notify("Commented successfully");
      } catch (error) {
        console.error("Error adding comment:", error);
        notify("Failed to add comment");
      }
    };

    const handleUserProfile = async(id)=>{
    navigate("/user-profile",{state:{id}})
    }

    useEffect(() => {
      fetchData();
    }, []);

    return (
      <div className='home'>
        {posts.length === 0 ? (
          <NoPostsMessage />
        ) : (
          posts.map((post, index) => {
            const isLiked = post.likes.length > 0;
            return (
              <div className="post-card" key={index}>
                <div className="header">
                  <div className="user-img-container">
                    <img src={`https://instagram-clone-fullstack.onrender.com/${post.postedBy.pic}`} alt="Profile" className="profile-pic" />
                    <span onClick={()=>handleUserProfile(post.postedBy._id)} style={{fontWeight:"normal",cursor:"pointer"}} className="username">{post.postedBy?.Fname}</span>
                  </div>
                  {post.postedBy?.username === currentUser ? (
                    <span onClick={() => handleDelete(post._id)} style={{ cursor: "pointer" }} className="material-symbols-outlined delete">
                      delete
                    </span>
                  ) : null}
                 </div>
                <div className="post-image">
                  <img src={`https://instagram-clone-fullstack.onrender.com/${post.file}`} alt="Post" />
                </div>
                <div style={{marginTop:5}} className="captions">
                  <span style={{fontWeight:"bolder"}} className="username">{post.postedBy?.username} </span>
                  <span style={{fontWeight:"normal"}} className="caption">{post.caption}</span>

                </div>
                <div className="interactions">
                  {isLiked ? (
                    <span style={{ cursor: "pointer", marginRight: 5 }} onClick={() => handleUnLike(post._id)} className="material-symbols-outlined">
                      thumb_down
                    </span>
                  ) : (
                    <span style={{ cursor: "pointer", marginRight: 5 }} onClick={() => handleLike(post._id)} className="material-symbols-outlined">
                      thumb_up
                    </span>
                  )}
                  <span className="material-symbols-outlined">mode_comment</span>
                </div>
                <div className="likes">{post.likes.length} likes</div>
                <div className="comments">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <span className="comment-user">{currentUser}: </span>
                      <span style={{ fontWeight: 'normal' }} className="comment-text">{comment.text}</span>
                    </div>
                  ))}
                </div>
                <div className="comment-input">
                  <span className="material-symbols-outlined">mood</span>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={() => handleComment(post._id)}>Post</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }

  export default Home;
