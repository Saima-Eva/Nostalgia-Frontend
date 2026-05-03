import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import Modal from 'react-modal';
import './Logout.css';

// Custom styling for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.16)',
    padding: '24px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
};

const Logout = ({ logoutUser }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const confirmLogout = () => {
    logoutUser();
    closeModal();
  };

  return (
    <div>
      <Link to="/" className='logout' onClick={(e) => { e.preventDefault(); openModal(); }}>
        <BiLogOut />
        <span>Log Out</span>
      </Link>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Confirm Logout">
        <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          Confirm Logout
        </h2>
        <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '14px' }}>
          Are you sure you want to log out? All your data will be cleared.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={closeModal}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: '#f3f4f6',
              color: '#374151',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
            onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
          >
            Cancel
          </button>
          <button 
            onClick={confirmLogout}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Yes, Logout
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Logout;
