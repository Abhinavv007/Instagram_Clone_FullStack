import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function UserProfile() {
    const currId = localStorage.getItem("id");
    const location = useLocation();
    const { id } = location.state;
    const [switchs, setSwitchs] = useState(localStorage.getItem(`followStatus-${id}`) === 'true');
    const [myposts, setMyPosts] = useState([]);
    const [username, setUsername] = useState("");
    const [pic, setPic] = useState("");
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };

            const response = await axios.get(`https://instagram-clone-fullstack.onrender.com/api/get-user-profile/${id}`, config);
            setMyPosts(response.data.msg);
            setUsername(response.data.msg[0]?.postedBy?.Fname);
            setPic(response.data.msg[0]?.postedBy?.pic);
            setFollowersCount(response.data.msg[0]?.postedBy?.followers.length);
            setFollowingCount(response.data.msg[0]?.postedBy?.following.length);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFollowClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            await axios.put(`https://instagram-clone-fullstack.onrender.com/api/follow/${id}`, {}, config);
            fetchData();
            localStorage.setItem(`followStatus-${id}`, 'true');
            setSwitchs(true);
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleUnFollowClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            await axios.put(`https://instagram-clone-fullstack.onrender.com/api/unfollow/${id}`, {}, config);
            fetchData();
            localStorage.setItem(`followStatus-${id}`, 'false');
            setSwitchs(false);  
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    return (
        <>
            <div className="profile-page">
                <div className="profile-header">
                    <img src={`https://instagram-clone-fullstack.onrender.com/${pic}`} alt="Profile" className="profile-pic2" />
                </div>
                <div className="stats">
                    <div className="username1">
                        {id !== currId && (switchs ? <button onClick={handleUnFollowClick} className='follow-button'>Unfollow</button> : <button onClick={handleFollowClick} className='follow-button'>Follow</button>)}

                        <h2 style={{ marginLeft: 10 }} className="username2">{username}</h2>

                        <span className='spans'>{myposts.length} posts</span>
                        <span className='spans'>{followersCount} followers</span>
                        <span className='spans'>{followingCount} following</span>
                    </div>
                </div>
            </div>
            <h4 style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 6, fontFamily: "sans-serif", fontWeight: "lighter" }}>{username}'s Posts</h4>

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

export default UserProfile;
