import { useState,useEffect } from 'react'
import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../../Components/Profile/ProfileMiddle'
import Right from '../../Components/RightSide/Right'
import Nav from '../../Components/Navigation/Nav'
import EditPro from '../../Components/EditPro/EditPro'
import Overseer from '../../Components/EditPro/Overseer/Overseer'
import "../Profile/Profile.css"
import ProfileImg from "../../assets/profile.jpg"
import { useUser } from '../../context/UserContext';
import img1 from "../../assets/User-post/img1.jpg"
import img2 from "../../assets/User-post/img2.jpg"
import img3 from "../../assets/User-post/img3.jpg"
import moment from 'moment'
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import SearchIcon from '@mui/icons-material/Search';
import React from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const EditProfile = () => {
  const { username } = useParams();
  console.log(username);
  const [userData, setUserData] = useState([]);
  const user= JSON.parse(localStorage.getItem('userData'));
  const [following, setFollowing] = useState(3);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [images, setImages] = useState(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(ProfileImg);
  const [data,setData] = useState("");
  const [userPostData, setUserPostData] = useState([]);
  const [modelDetails, setModelDetails] = useState(
    {
      ModelName: "",
      ModelUserName: "",
      ModelCountryName: "",
      ModelJobName: ""
    }
  );
  const userd= JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = React.useState(false);


  React.useEffect(() => {
    if (userd && username !== userd.username) {
      setShowModal(true);
    }
  }, [username, userd]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

   if (userd && username !== userd.username) {
    navigate(userd?`/profile/edit/${userd.username}`:'/login');
    return;

   }
   console.log(userData);
  // const [modelDetails,setModelDetails] = useState(
  //   {
  //     ModelName:user.first_name,
  //     ModelUserName:user.username,
  //     ModelCountryName:user.thana,
  //     ModelJobName:"Web Developer in Google"
  //   }
  // )
  
  console.log("bro");
  console.log(userPostData);

  return (
    <div className='interface'>
                 <Modal show={showModal} onHide={handleCloseModal} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-5 fw-bold"><i className="fas fa-exclamation-circle me-2"></i>Unauthorized Access</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <p className="mb-0">You are not authorized to edit this profile.</p>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top" style={{ padding: '1rem 2rem' }}>
          <Button variant="secondary" onClick={handleCloseModal} className="fw-bold">
            <i className="fas fa-times me-2"></i>Close
          </Button>
        </Modal.Footer>
      </Modal>
        <Nav
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        profileImg={profileImg}
        />
      <div className="home">
        <Left 
        following={following}
        setFollowing={setFollowing}
        profileImg={profileImg}
        modelDetails={modelDetails}
        
        />

        <EditPro/>
        
       <Overseer/>
      </div>
    </div>
  )
}

export default EditProfile