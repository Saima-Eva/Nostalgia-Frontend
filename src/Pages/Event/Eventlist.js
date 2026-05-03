import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './Buddylist.css';
import { Tab, Tabs, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import RequestList from './Request';
import MemberList from './EventMember';
import api from '../../util/api'

const Eventlist = () => {
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showInputBoxModal, setShowInputBoxModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userlist, setUserlist] = useState([]);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const fetchData = async () => {
    try {
      const response = await axios.get(`${api.url}:8000/event`, {
        params: { username: userData.username }
      });
      setUserlist(response.data.events);
      console.log(userlist);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value; // By default, use the selected value
    if(id === 'division') {
      findDistrict(value);
    }
    if(id === 'district') {
      findThana(value);
    }
    // If the id is "privacy", you can map the value to "Bondhu" or "Known"
    if (id === 'privacy') {
      newValue = value === 'Bondhu' ? 'Bondhu' : 'Known';
      console.log("yo");
      console.log(newValue);
    }
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: newValue
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowInputBoxModal(false);
    delete formData.time;

    try {
      await axios.post(`${api.url}:8000/event`, formData);
      console.log('Event data sent successfully:', formData);
      fetchData();
      // Reset form data after successful submission
      setFormData({
        title: '',
        e_creator: userData.username,
        address: '',
        start_date: new Date().toISOString().split('T')[0], // Set to current date
        create_date: new Date().toISOString().split('T')[0], // Set to current date
        end_date: new Date().toISOString().split('T')[0], // Set to current date
        start_time: '',
        end_time: '',
        Description: '',
        type: '',
        privacy: 'Bondhu',
        thana: "Dhaka"

      });
    } catch (error) {
      console.error('Error sending walk data:', error);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    e_creator: userData.username,
    address: '',
    start_date: new Date().toISOString().split('T')[0], // Set to current date
    create_date: new Date().toISOString().split('T')[0], // Set to current date
    end_date: new Date().toISOString().split('T')[0], // Set to current date
    start_time: '',
    Description: '',
    end_time: '',
    type: '',
    privacy: 'Bondhu',
    thana: "Dhaka"
  });
  const [members, setMembers] = useState([]);
  const fetchmembers = async (user) => {
    console.log("kauke passi na khujte khujte...");
    console.log(user);
    try {
    const response = await axios.get(`${api.url}:8000/eventmembers`, {
    params: { id: user.id }
    });
    setMembers(response.data);
    }catch (error) {
    console.error('Error fetching members:', error);
    }
    };
    const submitrequest = async (walk) => {
      console.log("hatte jabo tomar sathe.... niba?");
      if(walk.E_creator == userData.username){
        alert("You cannot request to join your own walk.");
        return;
      }
      try {
     const response= await axios.post(`${api.url}:8000/event_request`, { 
      id: walk.id,
      username: userData.username
      });
      fetchData();
      if(response.data.user == userData.username){
        alert("You have successfully joined the event.");
        return;
      }
      console.log('Request sent successfully:', walk.id); 
      alert("You have successfully joined the event.");
      } catch (error) {
        alert("Some issue! Try again after some moment!.");
        //something need to be done, as for network failure....
      console.error('Error sending request:', error);
      }
    };


  const handleUserInfoClick = (user) => {
    console.log("ogo, hete chole jaite mon chaitese na...");
    setSelectedUser(user);
    fetchmembers(user);
    setShowUserInfoModal(true);
  };

  const handleInputBoxButtonClick = () => {
    setShowInputBoxModal(true);
  };

  const handleClose = () => setShowUserInfoModal(false);
  const [divisions, setDivisions] = useState([
        "Dhaka",
        "Rajshahi",
        "Khulna",
        "Barishal",
        "Chattogram",
        "Sylhet",
        "Mymensingh"
    ]);
    const [upazilas, setUpazilas] = useState();
    const [districts, setDistricts] = useState([]);
    const findThana = (district) => {
        const res=axios.get(`${api.url}:8000/findthana`,{
            params: {
                district: district
            }
        }).then(response => {
            // Accessing the data from the response object
            console.log(response.data);
            setUpazilas(response.data);
        }).catch(error => {
            // Handling errors
            console.error('Error:', error);
        });
    }
    const findDistrict = (division) => {
        const res=axios.get(`${api.url}:8000/finddistrict`,{
            params: {
                division: division
            }
        }) .then(response => {
            // Accessing the data from the response object
            console.log(response.data);
            setDistricts(response.data);
        })
        .catch(error => {
            // Handling errors
            console.error('Error:', error);
        });

    }        
  return (
    <div className="vox mt-10 bg-light rounded-20px" style={{ overflowY: 'auto' }}>
      <div className="box">
        <div className="mt-3 row">
          <div className="col-6">
            <h1 className="toto">Event List</h1>
          </div>
          <div className="col-6">
            <Modal show={showInputBoxModal} onHide={() => setShowInputBoxModal(false)} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
              <Modal.Header closeButton className="bg-primary text-white border-0 planner-modal-header" style={{ padding: '1.25rem 1.5rem' }}>
                <Modal.Title className="fs-5 fw-bold"><i className="fas fa-calendar-plus me-2"></i>Create Event</Modal.Title>
              </Modal.Header>
              <Modal.Body className="planner-modal-body" style={{ padding: '1.5rem 2rem' }}>
                <form id="event-create-form" onSubmit={handleSubmit} className="planner-form">
                  <div className="planner-form-grid">
                    <div className="planner-field">
                      <label htmlFor="title" className="planner-label">Event Title</label>
                      <input type="text" className="form-control planner-input" id="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="planner-field">
                      <label htmlFor="Description" className="planner-label">Description</label>
                      <input type="text" className="form-control planner-input" id="Description" value={formData.Description} onChange={handleChange} required />
                    </div>

                    <div className="planner-field">
                      <label htmlFor="type" className="planner-label">Type</label>
                      <input type="text" className="form-control planner-input" id="type" value={formData.type} onChange={handleChange} required />
                    </div>

                    <div className="planner-field">
                      <label htmlFor="address" className="planner-label">Address</label>
                      <input type="text" className="form-control planner-input" id="address" value={formData.address} onChange={handleChange} required />
                    </div>

                    <div className="planner-date-row">
                      <div className="planner-field">
                        <label htmlFor="start_date" className="planner-label">Start Date</label>
                        <input type="date" className="form-control planner-input" id="start_date" value={formData.start_date} onChange={handleChange} required />
                      </div>
                      <div className="planner-field">
                        <label htmlFor="end_date" className="planner-label">End Date</label>
                        <input type="date" className="form-control planner-input" id="end_date" value={formData.end_date} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="planner-date-row">
                      <div className="planner-field">
                        <label htmlFor="start_time" className="planner-label">Start Time</label>
                        <input type="time" className="form-control planner-input" id="start_time" value={formData.start_time} onChange={handleChange} required />
                      </div>
                      <div className="planner-field">
                        <label htmlFor="end_time" className="planner-label">End Time</label>
                        <input type="time" className="form-control planner-input" id="end_time" value={formData.end_time} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="planner-field">
                      <label htmlFor="division" className="planner-label">Division</label>
                      <select className='form-control planner-input' name="division" id="division" onChange={handleChange}>
                        <option value="">Select Division</option>
                        {divisions.map((division) => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                    </div>

                    {districts && (
                      <div className="planner-field">
                        <label htmlFor="district" className="planner-label">District</label>
                        <select className='form-control planner-input' name="district" id="district" onChange={handleChange}>
                          <option value="">Select District</option>
                          {districts.map((district) => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {upazilas && (
                      <div className="planner-field">
                        <label htmlFor="thana" className="planner-label">Thana/Upazila</label>
                        <select className='form-control planner-input' name="thana" id="thana" onChange={handleChange}>
                          <option value="">Select Thana/Upazila</option>
                          {upazilas.map((upazila) => (
                            <option key={upazila} value={upazila}>{upazila}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="planner-field">
                      <label htmlFor="privacy" className="planner-label">Privacy</label>
                      <select className="form-control planner-input" id="privacy" value={formData.privacy} onChange={handleChange}>
                        <option value="Bondhu">Bondhu</option>
                        <option value="Known">Known</option>
                      </select>
                    </div>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer className="planner-modal-footer">
                <Button variant="secondary" className="event-modal-button event-modal-button-secondary" onClick={() => setShowInputBoxModal(false)}>Close</Button>
                <Button type="submit" form="event-create-form" className="event-modal-button event-modal-button-primary">Save</Button>
              </Modal.Footer>
            </Modal>
            {/* Button to open Input Box Modal */}
            <div style={{ textAlign: 'right' }}>
              <Button className="event-cta-button" onClick={handleInputBoxButtonClick}>Add New Event</Button>
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Creator</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>View Info</th>
            </tr>
          </thead>
          <tbody>
            {userlist && userlist.map(user => (
              <tr key={user.id}>
                {/* <td><img src={`http://localhost:8000/${user.img}`} alt="User" className="rounded" style={{ width: '50px', height: '50px' }} /></td> */}
                <td>{user.Event_title}</td>
                <td>{user.E_creator}</td>
                <td>{user.Address}</td>
                <td>{user.start_date}</td>
                <td>{user.end_date}</td>
                <td>{user.start_time}</td>
                <td>{user.end_time}</td>
                {user.E_creator == userData.username && (
                  <td><Button variant="primary" className="event-status-button event-status-owner" onClick={() => submitrequest(user)}>Owner</Button></td>
              )}
              {user.Member == 1  && !(user.E_creator == userData.username) &&(
                  <td><Button variant="success" className="event-status-button event-status-member" onClick={() => submitrequest(user)} >Member</Button></td>
              )}
              {user.member == 1 && user.not_ac == 1 && (
                <td><Button className="event-status-button event-status-requested" onClick={() => submitrequest(user)}>Requested</Button></td>
              )} 
              {user.member == 1 && user.cancel == 1 && (
                <td><Button variant="light" className="event-status-button event-status-cancel" onClick={() => submitrequest(user)}>Cancel</Button></td>
            )}
              {(user.E_creator != userData.username && user.Member == 0) && (
                  <td><Button variant="primary" className="event-status-button event-status-join" onClick={() => submitrequest(user)}>Join</Button></td>
              )}

              <td><Button variant="info" className="event-status-button event-status-info" onClick={() => handleUserInfoClick(user)}>View Info</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* User Info Modal */}
        <Modal show={showUserInfoModal} onHide={handleClose} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
         {/* <div className="bg-light"> */}
          <Modal.Header closeButton className="bg-primary text-white border-0 event-modal-header" style={{ padding: '1.5rem' }}>
            <Modal.Title className="fs-5 fw-bold"><i className="fas fa-calendar-alt me-2"></i>Event Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="event-modal-body" style={{ padding: '2rem' }}>
  <Tabs defaultActiveKey="details" className="event-tabs" mountOnEnter>
 {/* {userData && selectedUser && userData.username == selectedUser.E_creator && (
             <Tab eventKey="request" title="Request">
                  <RequestList fmembers={fetchmembers} user={selectedUser} />
                  </Tab>
                )} */}
    <Tab eventKey="details" title="Details" tabClassName="event-tab">
      {selectedUser && (
        <div className="event-detail-grid">
          <div className="event-detail-card"><span className="event-detail-label">Name</span><strong>{selectedUser.E_creator}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">Type</span><strong>{selectedUser.E_type}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">Location</span><strong>{selectedUser.Address}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">Thana</span><strong>{selectedUser.Thana}</strong></div>
          <div className="event-detail-card event-detail-card-wide"><span className="event-detail-label">Description</span><strong>{selectedUser.Description}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">Start Date</span><strong>{selectedUser.start_date}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">End Date</span><strong>{selectedUser.end_date}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">Start Time</span><strong>{selectedUser.start_time}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">End Time</span><strong>{selectedUser.end_time}</strong></div>
          <div className="event-detail-card"><span className="event-detail-label">Privacy</span><strong>{selectedUser.privacy}</strong></div>
        </div>
      )}
    </Tab>
    <Tab eventKey="members" title="Members" tabClassName="event-tab">
      {selectedUser && <div className="event-members-panel"><MemberList members={members} /></div>}
    </Tab>
  </Tabs>
</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="event-modal-button event-modal-button-secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
          {/* </div> */}
        </Modal>
      </div>
    </div>
  );
};

export default Eventlist;

