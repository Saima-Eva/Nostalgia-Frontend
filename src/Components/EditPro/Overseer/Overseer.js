import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Overseer.css";
import { Modal, Button, Form} from 'react-bootstrap';
import api from '../../../util/api';

const Overseer = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    email: '',
    Location: '',
    Relation: ''
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      const userData = stored ? JSON.parse(stored) : null;
      setUser(userData);
    } catch (err) {
      console.error('Error parsing userData in Overseer:', err);
      setUser(null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [fndlist, setfndlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user && user.username) {
      fetchOverseerList();
    }
  }, [user]);
  
  const fetchOverseerList = () => {
    if (!user || !user.username) {
      console.warn('User data not available for fetching overseer list');
      return;
    }
    axios.get(`${api.url}:8000/overseerlist`, {
      params: {
        target: user.username
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
      if(formData.username.includes("@")){
        alert("Username can't contain '@'");
        return;

      }
      if(fndlist.find((person)=> person.username===formData.username)){
        alert("Username already exists");
        return;
      }
      console.log('Data submitted:', formData);
      formData.username= formData.username+"@"+user.username;

      formData.address= formData.Location;
      formData.dob="2021-09-01";
      formData.thana="Dhaka";
      formData.nid="5288";
      formData.gender="Male";
      const response = await axios.post(`${api.url}:8000/add_overseer`, formData);
       
      console.log('Data submitted:', response.data);
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        phone: '',
        email: '',
        Location: '',
        Relation: ''
      });
      fetchOverseerList();
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  const handleDelete = async (username) => {
    console.log(username);
    try{
    const response = await axios.post(`${api.url}:8000/doverseer`,
      { username: username, user: user.username });
      alert(response.data.message);
    fetchOverseerList();
  }catch(error){
    console.error('Error submitting data:', error);
    alert("Error Deleting Overseer");
  }
}
  const [errors, setErrors] = useState({
    type: '',
    institution: ''
  });
  // State for the new modal
  const [showAdditionalModal, setShowAdditionalModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    type: '',
    content: '',
    username: user?.username || ''
  });

  // Update additionalInfo when user changes
  useEffect(() => {
    if (user?.username) {
      setAdditionalInfo(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [user]);

  // Function to handle changes in the additional info form
  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo({ ...additionalInfo, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error message when input changes
  };
  // Function to handle submitting the additional info form
  const handleSubmitAdditionalInfo = async(e) => {
    e.preventDefault();
    setShowAdditionalModal(false);

    if (!additionalInfo.type || !additionalInfo.content) {
      alert('Please fill all the fields');
      return;
    }

    // Handle submission of additional info, e.g., send it to the server
    console.log('Additional Info Submitted:', additionalInfo);
    const response = axios.post(`${api.url}:8000/addhandle`, additionalInfo);
    console.log('Additional Info Response:', response.data);
    // Clear the form fields
    setAdditionalInfo({
      type: '',
      content: '',
      username: user?.username || ''
    });
    // Close the additional info modal
    
  };
  const handleAddAdditionalInfo = () => {
    setShowAdditionalModal(true);
  };
    return (
    <div className="Sugg-comp">
      <h2 className="font-weight-bold">Overseer List</h2>

      {fndlist.map((person, index) => (
        <div className="sugg-people" key={index}>
          <div className="s-left">
            <img  src= {`${api.url}:8000/${person.pp}`} alt="" />
            <h3>{person.first_name}</h3>
            <h3>{person.last_name}</h3>
          </div>

          <div className="s-right">
            <button onClick={() => handleViewUser(person)}>View</button>
            <button onClick={()=> handleDelete(person.username)}>Delete</button>
          </div>
        </div>
      ))}
     <Modal show={showAdditionalModal} onHide={() => setShowAdditionalModal(false)} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-5 fw-bold"><i className="fas fa-plus-circle me-2"></i>Add Additional Info</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <Form>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" name="type" value={additionalInfo.type} onChange={handleAdditionalChange}>
                <option value="">Select Type</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Job">Job</option>
                {/* <option value="College">College</option> */}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="institution">
              <Form.Label>Institution</Form.Label>
              <Form.Control type="text" name="content" value={additionalInfo.content} onChange={handleAdditionalChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top" style={{ padding: '1rem 2rem' }}>
          <Button variant="secondary" onClick={() => setShowAdditionalModal(false)} className="fw-bold"><i className="fas fa-times me-2"></i>Close</Button>
          <Button variant="primary" onClick={handleSubmitAdditionalInfo} className="fw-bold"><i className="fas fa-save me-2"></i>Save</Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showModal} onHide={handleCloseModal} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-5 fw-bold"><i className="fas fa-user-plus me-2"></i>Add Overseer</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="Relation">
              <Form.Label>Relation</Form.Label>
              <Form.Control type="text" name="Relation" value={formData.Relation} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="Location">
              <Form.Label>Location</Form.Label>
              <Form.Control as="textarea" name="Location" value={formData.Location} onChange={handleChange} />
            </Form.Group>
            {/* Add other form fields similarly */}
            <Button variant="primary" type="submit" className="mt-4 w-100 fw-bold"><i className="fas fa-plus me-2"></i>Add Overseer</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top" style={{ padding: '1rem 2rem' }}>
          <Button variant="secondary" onClick={handleCloseModal} className="fw-bold"><i className="fas fa-times me-2"></i>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-info text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-5 fw-bold"><i className="fas fa-user me-2"></i>View Overseer</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {/* Display details of the selected overseer */}
          {selectedUser && (
            <div>
              <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={selectedUser.username} readOnly />
                  </Form.Group>
                </div>
              </div>
              <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" value={selectedUser.first_name} readOnly />
                  </Form.Group>
                </div>
              </div>
              <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" value={selectedUser.last_name} readOnly />
                  </Form.Group>
                </div>
              </div>
            <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" value={selectedUser.phone} readOnly />
                  </Form.Group>
                </div>
              </div>
               <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={selectedUser.email} readOnly />
                  </Form.Group>
                </div>
              </div>
              {/* <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={selectedUser.password} readOnly />
                  </Form.Group>
                </div>
              </div> */}
               <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control type="text" value={selectedUser.gender} readOnly />
                  </Form.Group>
                </div>
              </div> 
              <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formRelation">
                    <Form.Label>Relation</Form.Label>
                    <Form.Control type="text" value={selectedUser.relation} readOnly />
                  </Form.Group>
                </div>
              </div> 
              <div className="card mb-2">
                <div className="card-body">
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" value={selectedUser.address} readOnly />
                  </Form.Group>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Button to open modal */}
      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleAddOverseer}>Add Overseer</Button>
      </div>
      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleAddAdditionalInfo}>Add Additional Info</Button>
        </div>
    </div>
  )
}

export default Overseer;
