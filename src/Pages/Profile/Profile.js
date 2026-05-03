import { useState, useEffect } from 'react'
import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../../Components/Profile/ProfileMiddle'
import Right from '../../Components/RightSide/Right'
import Nav from '../../Components/Navigation/Nav'
import "../Profile/Profile.css"
import ProfileImg from "../../assets/profile.jpg"
import { useUser } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../util/api'

const Profile = () => {
  const { username: urlUsername } = useParams();
  const { userData: loggedInUser, setUserData: updateUserData } = useUser();
  
  // Local state for profile data and UI
  const [profileData, setProfileData] = useState({});
  const [following, setFollowing] = useState(3);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [images, setImages] = useState(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [userPostData, setUserPostData] = useState([]);

  // Fetch profile data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${api.url}:8000/profile/${urlUsername}`, {
        params: {
          username: urlUsername,
          user: loggedInUser?.username
        }
      });
      
      if (response.status === 200) {
        setProfileData(response.data);
        console.log('Profile data fetched:', response.data);
        
        // If this is the logged-in user's own profile, update the global context
        if (loggedInUser && loggedInUser.username === urlUsername && response.data.p_image_url) {
          // Merge the fresh profile data with existing context data
          const updatedUserData = {
            ...loggedInUser,
            ...response.data,
          };
          updateUserData(updatedUserData);
          console.log('Updated user context with fresh profile data');
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (urlUsername) {
      fetchUserData();
    }
  }, [urlUsername, loggedInUser?.username]);

  return (
    <div className='interface'>
      <Nav
        setShowMenu={setShowMenu}
      />
      
      <div className="home">
        <Left 
          following={following}
          setFollowing={setFollowing}
        />
        
        <ProfileMiddle 
          following={following}
          search={search}
          images={images}
          setImages={setImages}
          name={name}
          setName={setName}
          userName={userName}
          setUserName={setUserName}
          userData={profileData}
          setUserData={setProfileData}
          userPostData={userPostData}
          setUserPostData={setUserPostData}
          fetchUserData={fetchUserData}
        />
        
        <Right 
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          following={following}
          setFollowing={setFollowing}
        />
      </div>
    </div>
  )
}

export default Profile