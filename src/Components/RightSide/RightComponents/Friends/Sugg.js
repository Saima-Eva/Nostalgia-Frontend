import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Sugg.css";
import { Modal, Button, Form, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../../../util/api';

const Friends = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    privacy: '',
    topic: '',
    phone: '',
    email: '',
  });
  const [groupImage, setGroupImage] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      const userData = stored ? JSON.parse(stored) : null;
      setUser(userData);
    } catch (err) {
      console.error('Error parsing userData in Friends:', err);
      setUser(null);
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGroupImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;
    if(id == 'privacy') {
      console.log('Privacy:', value);
      newValue = value;
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: newValue
    }));
  };
  const [fndlist, setfndlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    if (user && user.id) {
      fetchOverseerList();
    }
  }, [user]);

  const fetchOverseerList = () => {
    if (!user || !user.id) {
      console.warn('User data not available for fetching friends');
      return;
    }
    axios.get(`${api.url}:8000/friends`, {
      params: {
        user_id: user.id
      }
    })
      .then(response => {
        setfndlist(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };




  const handleAddOverseer = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAlertInfo({ show: false, message: '', variant: 'success' });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('id', user.id);
      submitData.append('username', formData.username);
      submitData.append('name', formData.name);
      submitData.append('topic', formData.topic);
      submitData.append('privacy', formData.privacy || 'Bondhu');
      if (groupImage) {
        submitData.append('img', groupImage);
      }
      const response = await axios.post(`${api.url}:8000/add_group`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if(response.data.msg === "Group already exists"){
        alert("Group With this Username already exists")
        return;
      }
       
      console.log('Data submitted:', response.data);
      setFormData({
        username: '',
        name: '',
        privacy: '',
        topic: '',
        phone: '',
        email: '',
      });
      fetchOverseerList();
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    
    <div className="Sugg-comp">
            {/* <div className="text-center mt-1">
        <Button variant="primary" onClick={handleAddOverseer}> Create Group</Button>
        <hr/>

   </div> */}
      <h2 className="mt-3font-weight-bold ">Your Friends</h2>
      {fndlist && fndlist.slice(0,7).map((fnd, index) => (
        <div className="sugg-people" key={index}>
          <div className="s-left">
            <img  src= {`${api.url}:8000/${fnd.pp}`} alt="" />
            <h3>{fnd.first_name} {fnd.last_name}</h3>
          </div>

          <div className="s-right">
            <Link to={`/profile/${fnd.username}`}><button>View</button></Link>
             <Link to={`/chat/${fnd.username}`}><button>Message</button></Link>
          </div>
        </div>
      ))}
      <div className="text-center">
      <Link to='/friend'><button className="SM-btn">ALL Friends</button></Link>
      </div>


      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" fullscreen="sm-down">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label className="fw-bold">Group Username</Form.Label>
              <Form.Control type="text" name="username" placeholder="e.g., cool_group_123" value={formData.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="fw-bold">Group Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter group name" value={formData.name} onChange={handleChange} required />
            </Form.Group>  
            <Form.Group controlId="topic" className="mb-4">
              <Form.Label className="fw-bold">Topic</Form.Label>
              <Form.Control type="text" name="topic" placeholder="What is this group about?" value={formData.topic} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="groupImage" className="mb-4"><Form.Label className="fw-bold">Group Photo</Form.Label><Form.Control type="file" accept="image/*" onChange={handleImageChange} /></Form.Group><Form.Group controlId="groupImage" className="mb-4"><Form.Label className="fw-bold">Group Photo</Form.Label><Form.Control type="file" accept="image/*" onChange={handleImageChange} /></Form.Group><Form.Group controlId="privacy" className="mb-4">
              <Form.Label className="fw-bold">Privacy Setting</Form.Label>
              <Form.Control as="select" name="privacy" value={formData.privacy} onChange={handleChange} className="form-select">
                <option value="Bondhu">Bondhu (Friends only)</option>
                <option value="Known">Known (Connections)</option>
                <option value="Public">Public (Anyone)</option>
                <option value="Private">Private (Invite only)</option>
              </Form.Control>
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="py-2 fw-bold shadow-sm">
                Create Group
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg" fullscreen="sm-down">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          {selectedUser && (
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-md-6"><div className="card shadow-sm h-100"><div className="card-body"><h6 className="text-muted mb-1">Username</h6><p className="fs-5 fw-semibold mb-0">{selectedUser.username}</p></div></div></div>
                <div className="col-md-6"><div className="card shadow-sm h-100"><div className="card-body"><h6 className="text-muted mb-1">Full Name</h6><p className="fs-5 fw-semibold mb-0">{selectedUser.first_name} {selectedUser.last_name}</p></div></div></div>
                <div className="col-md-6"><div className="card shadow-sm h-100"><div className="card-body"><h6 className="text-muted mb-1">Phone</h6><p className="fs-5 fw-semibold mb-0">{selectedUser.phone}</p></div></div></div>
                <div className="col-md-6"><div className="card shadow-sm h-100"><div className="card-body"><h6 className="text-muted mb-1">Email</h6><p className="fs-5 fw-semibold mb-0">{selectedUser.email}</p></div></div></div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Button to open modal */}
    </div>
  )
}

export default Friends;







