import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ExamplePage = () => {
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showInputBoxModal, setShowInputBoxModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Dummy data for the list
  const userList = [
    { id: 1, name: 'John Doe', location: 'New York', date: 'April 1, 2024', time: '10:00 AM' },
    { id: 2, name: 'Jane Smith', location: 'Los Angeles', date: 'April 2, 2024', time: '11:00 AM' },
    // Add more users as needed
  ];

  const handleUserInfoClick = (user) => {
    setSelectedUser(user);
    setShowUserInfoModal(true);
  };

  const handleInputBoxButtonClick = () => {
    setShowInputBoxModal(true);
  };

  return (
    <div className="container">
      <div className="box">
      <div className="mt-3 row">
        <div className="col-6">
          <h1>User List</h1>
      </div>
    <div className="col-6">
    <Modal show={showInputBoxModal} onHide={() => setShowInputBoxModal(false)} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-5 fw-bold"><i className="fas fa-walking me-2"></i>Walking List</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <Form>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group controlId="time">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" />
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="walkName">
              <Form.Label>Walk Name</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="privacy">
              <Form.Label>Privacy</Form.Label>
              <Form.Control as="select">
                <option>Friends</option>
                <option>Known</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top" style={{ padding: '1rem 2rem' }}>
          <Button variant="secondary" onClick={() => setShowInputBoxModal(false)} className="fw-bold"><i className="fas fa-times me-2"></i>Close</Button>
          <Button variant="primary" onClick={() => setShowInputBoxModal(false)} className="fw-bold"><i className="fas fa-save me-2"></i>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Button to open Input Box Modal */}
      <div style={{ textAlign: 'right' }}>
        <Button variant="primary" onClick={handleInputBoxButtonClick}>Walking List</Button>
      </div>
    </div>
</div>   
     
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Request</th>
            <th>View Info</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id}>
              <td>Image</td>
              <td>{user.name}</td>
              <td>{user.location}</td>
              <td>{user.date}</td>
              <td>{user.time}</td>
              <td><Button variant="primary">Request</Button></td>
              <td><Button variant="info" onClick={() => handleUserInfoClick(user)}>View Info</Button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Info Modal */}
      <Modal show={showUserInfoModal} onHide={() => setShowUserInfoModal(false)} size="lg" fullscreen="lg-down" centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-info text-white border-0" style={{ padding: '1.5rem' }}>
          <Modal.Title className="fs-5 fw-bold"><i className="fas fa-user me-2"></i>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Location:</strong> {selectedUser.location}</p>
              <p><strong>Date:</strong> {selectedUser.date}</p>
              <p><strong>Time:</strong> {selectedUser.time}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserInfoModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  </div>
  );
};

export default ExamplePage;
