import React, { useState,useEffect } from 'react';
import "../Post/InputPost.css";
import Profile from "../../assets/profile.jpg";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';
import api from '../../util/api';

const InputPost = ({fetchPosts}) => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');
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
      console.error('Error parsing userData in InputPost:', err);
      setUserData(null);
    }
  }, []);

  const [post, setpost] = useState({
    username: userData?.username || '',
    content: '',
    post_date: formattedDate,
    post_time: formattedTime,
    blog_img: ""
  });
  const [images, setImages] = useState(null);

  // Update post username when userData loads
  useEffect(() => {
    if (userData && userData.username) {
      setpost(prev => ({
        ...prev,
        username: userData.username
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setpost({ ...post, [name]: value });
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setpost({ ...post, blog_img: file });
    setImages(file);
    //console.log(post.file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData || !userData.username) {
      alert('User data not available. Please refresh the page.');
      return;
    }

    if (!post.content.trim()) {
      alert('Please enter some content for your post.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', post.username);
      formData.append('content', post.content);
      formData.append('post_date', post.post_date);
      formData.append('post_time', post.post_time);
      formData.append('token', token);

      // Only append image if one was selected
      if (post.blog_img && post.blog_img instanceof File) {
        formData.append('blog_img', post.blog_img);
      }

      console.log('Submitting post:', {
        username: post.username,
        content: post.content,
        date: post.post_date,
        time: post.post_time,
        hasImage: post.blog_img instanceof File
      });

      const response = await axios.post(`/addblog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Post created successfully:', response.data);
      alert('Post shared successfully!');
      
      // Reset form data
      setpost({
        username: userData.username,
        content: '',
        post_date: formattedDate,
        post_time: formattedTime,
        blog_img: ""
      });
      setImages(null);
      
      // Fetch updated posts
      if (fetchPosts) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else if (error.response?.status === 400) {
        alert('Bad request. Please check your post content.');
      } else if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
      } else {
        alert('Error sharing post. Please try again.');
      }
    }
  };

  return (
    <div className="i-form">
      <form onSubmit={onSubmit}>
        <div className="i-input-box">
        <img src={getProfileImageUrl()} className='i-img' onError={(e) => {e.target.src = Profile}}/>
          <input 
            type="text" 
            id="i-input" 
            placeholder={`What's in your mind ${userData?.first_name || 'User'}?`}
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

            <label htmlFor="video-file" className="pv-upload">
              <PlayCircleFilledOutlinedIcon className="input-svg" style={{fontSize:"24px",color:"#FF0000"}}/>
              <span className='photo-dis'>Video</span>
            </label>

            <div className="pv-upload" onClick={() => alert('Feelings/Activity feature coming soon!')}>
              <SentimentSatisfiedAltIcon className="input-svg" style={{fontSize:"24px",color:"#FFD700"}}/>
              <span className='photo-dis'>Feeling</span>
            </div>

            <div className="pv-upload" onClick={() => alert('Live feature coming soon!')}>
              <FiberManualRecordIcon className="input-svg" style={{fontSize:"24px",color:"#FF4444"}}/>
              <span className='photo-dis'>Live</span>
            </div>
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
          <input 
            type="file" 
            id="video-file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                alert('Video upload feature coming soon!');
              }
            }}
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

export default InputPost;
