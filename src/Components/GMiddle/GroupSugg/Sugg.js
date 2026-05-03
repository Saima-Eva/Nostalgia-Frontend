import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Sugg.css";
import { Modal, Button, Form, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../../util/api';

const Sugg = (fetchOverseerList) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    privacy: '',
    topic: '',
    phone: '',
    email: '',
  });
  const [groupImage, setGroupImage] = useState(null);
  const user= JSON.parse(localStorage.getItem('userData'));

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
    fetchgrouplist();
  }, []);


  const fetchgrouplist = () => {
    axios.get(`${api.url}:8000/!my_groups`, {
      params: {
        user_id: user.id
      }
    })
      .then(response => {
        setfndlist(response.data);
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
  // Define the dlt function to send a POST request
  const dlt = async (groupUsername, username) => {
    try {
      const formData = {
        guser: groupUsername,
        username: username
      };
      const response = await axios.post(`${api.url}:8000/deletegroup`, formData);
      if (response.status === 201) {
        console.log('Successfully left the group');
        alert("Successfully left the group");
        fetchgrouplist();
      } else {
        console.error('Failed to leave the group');
      }
    } catch (error) {
      console.error('Error leaving the group:', error);
    }
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
        setAlertInfo({ show: true, message: "Group With this Username already exists", variant: 'danger' });
        return;
      }
      console.log('Data submitted:', response.data);
      setAlertInfo({ show: true, message: "Group successfully created!", variant: 'success' });
      setFormData({
        username: '',
        name: '',
        privacy: '',
        topic: '',
        phone: '',
        email: '',
      });
      fetchgrouplist();
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error('Error submitting data:', error);
      setAlertInfo({ show: true, message: "Failed to create group. Please try again.", variant: 'danger' });
    }
  };

  const Join =async (guser,username) => {
    const response = await axios.post(`${api.url}:8000/join_group`, {
      user_id: user.id,
      group : guser,
      type: "join"
    });
    if(response.ok==0){
      alert("You are already a member of this group");
      return;
    }
    console.log("in join");
    console.log(guser);
    fetchgrouplist();
    // fetchOverseerList();
    //setgroup({...group,member:1});
  };
  return (
    
    <div className="Sugg-comp">

      <h2 className="mt-3font-weight-bold ">Groups Suggestions</h2>

      {fndlist.map((group, index) => (
        <div className="sugg-people" key={index}>
          <div className="s-left">
            <img  src= {`${api.url}:8000/${group.img}`} alt="" />
            <h3>{group.name}</h3>
          </div>

          <div className="s-right">
            <Link to={`/group/${group.username}`}><button>View</button></Link>
          <button onClick={() => Join(group.username, user.username)}>Join</button>
          </div>
        </div>
      ))}

      <Modal show={showModal} onHide={handleCloseModal} centered size="xl" fullscreen="lg-down" className="modal-xl-custom" backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-4 fw-bold">Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem', minHeight: '500px' }}>
          {alertInfo.show && (
            <Alert variant={alertInfo.variant} onClose={() => setAlertInfo({ ...alertInfo, show: false })} dismissible className="mb-4">
              {alertInfo.message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <Form.Group controlId="username">
                  <Form.Label className="fw-bold fs-6 mb-2">Group Username</Form.Label>
                  <Form.Control type="text" name="username" placeholder="e.g., cool_group_123" value={formData.username} onChange={handleChange} required style={{ padding: '0.75rem', fontSize: '1rem' }} />
                  <Form.Text className="text-muted d-block mt-2">Unique identifier for your group (lowercase, numbers, underscores)</Form.Text>
                </Form.Group>
              </div>
              <div className="col-lg-6 mb-4">
                <Form.Group controlId="name">
                  <Form.Label className="fw-bold fs-6 mb-2">Group Name</Form.Label>
                  <Form.Control type="text" name="name" placeholder="Enter an appealing group name" value={formData.name} onChange={handleChange} required style={{ padding: '0.75rem', fontSize: '1rem' }} />
                  <Form.Text className="text-muted d-block mt-2">Display name visible to all members</Form.Text>
                </Form.Group>
              </div>
            </div>
            <div className="mb-4">
              <Form.Group controlId="topic">
                <Form.Label className="fw-bold fs-6 mb-2">Group Topic/Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="topic" placeholder="What is this group about? What are your interests?" value={formData.topic} onChange={handleChange} required style={{ padding: '0.75rem', fontSize: '1rem', resize: 'vertical' }} />
                <Form.Text className="text-muted d-block mt-2">Brief description to help people understand your group</Form.Text>
              </Form.Group>
            </div>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <Form.Group controlId="groupImage">
                  <Form.Label className="fw-bold fs-6 mb-2">Group Photo</Form.Label>
                  <div className="border-2 border-dashed p-4 text-center rounded" style={{ borderColor: '#dee2e6', cursor: 'pointer' }}>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="d-none" id="file-upload" />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <div className="mb-2">
                        <i className="fas fa-image" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
                      </div>
                      <div className="text-muted">Click to upload or drag & drop</div>
                      <Form.Text className="text-muted d-block mt-2">PNG, JPG, GIF up to 10MB</Form.Text>
                    </label>
                  </div>
                  {formData.image && <div className="mt-3 text-success"><i className="fas fa-check-circle"></i> {formData.image.name}</div>}
                </Form.Group>
              </div>
              <div className="col-lg-6 mb-4">
                <Form.Group controlId="privacy">
                  <Form.Label className="fw-bold fs-6 mb-2">Privacy Setting</Form.Label>
                  <Form.Control as="select" name="privacy" value={formData.privacy} onChange={handleChange} className="form-select" style={{ padding: '0.75rem', fontSize: '1rem' }}>
                    <option value="Bondhu">Bondhu (Friends only)</option>
                    <option value="Known">Known (Connections)</option>
                    <option value="Public">Public (Anyone)</option>
                    <option value="Private">Private (Invite only)</option>
                  </Form.Control>
                  <Form.Text className="text-muted d-block mt-2">Control who can see and join your group</Form.Text>
                </Form.Group>
              </div>
            </div>
            <div className="d-grid gap-2 mt-5">
              <Button variant="primary" type="submit" className="py-3 fw-bold shadow-sm" style={{ fontSize: '1.1rem' }}>
                <i className="fas fa-plus"></i> Create Group
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg" fullscreen="sm-down" backdrop="static" keyboard={false}>
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

export default Sugg;








