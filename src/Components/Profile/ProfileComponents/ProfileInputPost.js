import React, { useState, useEffect } from 'react';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axios from 'axios';
import api from '../../../util/api';
import Profile from '../../../assets/profile.jpg';
import '../../../Components/Post/InputPost.css';
const ProfileInputPost = (fetchPosts) => {
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
  }, []);

  const [post, setPost] = useState({
    username: userData?.username || '',
    content: '',
    post_date: formattedDate,
    post_time: formattedTime,
    blog_img: ""
  });

  // Update post username when userData loads
  useEffect(() => {
    if (userData && userData.username) {
      setPost(prev => ({
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

  const [images, setImages] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPost({ ...post, blog_img: file });
    setImages(file);
  };



  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(post).forEach(([key, value]) => {
        if (key === 'blog_img' && !(value instanceof File)) {
          return;
        }
        formData.append(key, value);
      });

      const response = await axios.post(`${api.url}:8000/addblog`, formData);
      alert('Blog created successfully');
      // fetchPosts();
      setPost({
        username: userData.username,
        content: '',
        post_date: formattedDate,
        post_time: formattedTime,
        blog_img: null
      });
      setImages(null);
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog. Please try again.');
    }
  };

  return (
    <div className="i-form">
      <form onSubmit={onSubmit}>
        <div className="i-input-box">
          <img src={getProfileImageUrl()} className='i-img' alt="Profile" onError={(e) => {e.target.src = Profile}} />
          <input
            type="text"
            id="i-input"
            placeholder={`What's on your mind, ${userData?.first_name || 'User'}?`}
            required
            value={post.content}
            onChange={handleChange}
            name="content"
          />
        </div>

        <div className="file-upload">
          <div className="file-icons">
            <label htmlFor="file" className="pv-upload">
              <PhotoLibraryIcon className="input-svg" style={{ fontSize: "24px", color: "orangered" }} />
              <span className='photo-dis'>Photo</span>
            </label>
          </div>
          <button type='submit'>Share</button>
        </div>

        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {images && (
          <div className="displayImg">
            <CloseRoundedIcon onClick={() => setImages(null)} />
            <img src={URL.createObjectURL(images)} alt="Selected" />
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInputPost;
