
import React, { useState,useEffect } from 'react';
import { Badge, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
const MemberList = ({Rmembers,guser,group,members}) => {
    const user = JSON.parse(localStorage.getItem('userData'));

    const genderBadge = (gender) => {
      const variants = {
        'Male': 'primary',
        'Female': 'danger',
        'Other': 'secondary'
      };
      return <Badge bg={variants[gender] || 'secondary'}>{gender || 'N/A'}</Badge>;
    };

    if (!members || members.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="fas fa-users" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
          <p className="text-muted">No members yet</p>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', padding: '0', display: 'flex' }}>
        <Row xs={1} sm={1} md={2} lg={3} xl={4} className="g-4 mt-0" style={{ width: '100%', margin: '0' }}>
          {members && members.map(member => (
            <Col key={member.id} style={{ minWidth: 0, padding: '0.5rem' }}>
              <Card className="h-100 shadow-sm border-0 hover" style={{ 
                transition: 'all 0.3s ease', 
                cursor: 'pointer',
                overflow: 'visible',
                width: '100%'
              }}>
                <div style={{ height: '80px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '3px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e9ecef',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    {member.first_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <Card.Body style={{ paddingTop: '2.5rem', textAlign: 'center', padding: '2rem 0.75rem 1.5rem 0.75rem', wordBreak: 'break-word', overflow: 'visible' }}>
                  <Card.Title className="fw-bold fs-6 mb-2" style={{ 
                    overflow: 'visible',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    hyphens: 'auto',
                    minHeight: '2.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.95rem'
                  }}>
                    {member.first_name} {member.last_name || ''}
                  </Card.Title>
                  <div className="mb-2">
                    {genderBadge(member.gender)}
                  </div>
                  <div className="text-muted small mb-3" style={{ whiteSpace: 'normal', fontSize: '0.85rem' }}>
                    <i className="fas fa-calendar-alt me-1"></i>
                    {member.Since ? new Date(member.Since).toLocaleDateString() : 'Recently joined'}
                  </div>
                  {user.username==group.admin && user.username !== member.username && (
                    <div style={{ fontSize: '0.85rem', color: '#6c757d' }} className="mt-2">
                      <i className="fas fa-crown" style={{ color: '#ffc107' }}></i> Admin Controls Available
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
          };
export default MemberList;