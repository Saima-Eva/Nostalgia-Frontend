import React, { useState,useEffect } from 'react';
import "../../Post/InputPost.css";
import Profile from "../../../assets/profile.jpg";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';
import { FaSmile } from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../../../util/api';

const ProfileInputPost = ({fetchPosts,fmembers,group}) => {
  const [userData, setUserData] = useState(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false });

  // Load userData from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      const parsedData = stored ? JSON.parse(stored) : null;
      setUserData(parsedData);
    } catch (err) {
      console.error('Error parsing userData in ProfileInputPost:', err);
      setUserData(null);
    }
    fmembers();
  }, []);

  const [post, setpost] = useState({
    username: userData?.username || '',
    content: '', // State variable for content
    post_date: formattedDate,
    post_time: formattedTime,
    blog_img: "",
    gp: group?.username || ''
  });

  // Update post when userData loads
  useEffect(() => {
    if (userData && userData.username) {
      setpost(prev => ({
        ...prev,
        username: userData.username
      }));
    }
  }, [userData]);

  // Helper function to construct profile image URL
  const getProfileImageUrl = () => {
    if (!userData) return Profile;
    
    // Try p_image_url first (new format from backend)
    if (userData.p_image_url) {
      return `${api.url}:8000${userData.p_image_url}`;
    }
    
    // Fallback to p_image (old format)
    if (userData.p_image) {
      const imagePath = userData.p_image;
      // Check if path already includes 'media/' prefix
      if (imagePath.startsWith('media/') || imagePath.startsWith('/media/')) {
        return `${api.url}:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
      } else {
        return `${api.url}:8000/media/${imagePath}`;
      }
    }
    return Profile;
  };

  const [images, setImages] = useState(null); // State variable for images

  const handleChange = (e) => {
    const { name, value } = e.target;
    setpost({ ...post, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setpost({ ...post, blog_img: file });
    setImages(file);
    //console.log(post.file);
  };

  
  const onSubmit = async (e) => {
    e.preventDefault();
    let i=0;
    try {
      const formData = new FormData();
      Object.entries(post).forEach(([key, value]) => {
        console.log(key, value);
        if(key === 'blog_img' && !(value instanceof File)) {
          console.log('No image provided.');  
          return; 
        }
        formData.append(key, value);  
      });
      //console.log(formData);
      const response = await axios.post(`${api.url}:8000/addgroupost`, formData);
      console.log(response.data); 
      console.log(group.username);
      alert('Group Post created successfully');
      i=1;
      // Reset form data
      setpost({
        username: userData?.username || '',
        content: '',
        post_date: formattedDate,
        post_time: formattedTime,
        blog_img: null,
        gp: group?.username || ''
      });
       fetchPosts();
      setImages(null); // Reset images state
    } catch (error) {
      console.error('Error creating blog:', error);
      if(i==0)alert('Error creating blog. Please try again.');
    }
  };

  return (
    <div className="i-form">
      <form onSubmit={onSubmit}>
        <div className="i-input-box">
        <img src={getProfileImageUrl()} className='i-img' alt="Profile" onError={(e) => {e.target.src = Profile}}/>
          <input 
            type="text" 
            id="i-input" 
            placeholder={`What's in your mind, ${userData?.first_name || 'User'}?`}
            required
            value={post.content} // Use formData.content instead of body
            onChange={handleChange} // Use handleChange for content change
            name="content" // Set name for content
          />
        </div>

        <div className="file-upload">
          <div className="file-icons">
            <label htmlFor="file" className="pv-upload">
              <PhotoLibraryIcon className="input-svg" style={{fontSize:"24px",color:"orangered"}}/>
              <span className='photo-dis'>Photo</span>
            </label>
            {/* <div className="pv-upload">
              <PlayCircleFilledOutlinedIcon className="input-svg" style={{fontSize:"24px",color:"black"}}/>
              <span className='photo-dis'>Video</span>
            </div>

            <div className="pv-upload">
              <KeyboardVoiceRoundedIcon className="input-svg" style={{fontSize:"24px",color:"green"}}/>
              <span className='photo-dis'>Audio</span>
            </div>

            <div className="pv-upload">
              <FaSmile className="input-svg" style={{fontSize:"20px",color:"red"}}/>
              <span className='photo-dis'>Feelings/Activity</span>
            </div> */}
          </div>
          <button type='submit'>Share</button>

        </div>


        <div style={{display:"none"}} >
          <input 
            type="file" 
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {images && (
          <div className="displayImg">
            <CloseRoundedIcon onClick={()=>setImages(null)}/>
            <img src={URL.createObjectURL(images)} alt="" />
          </div>
        )}

      </form>
    </div>
  );
};

export default ProfileInputPost;
