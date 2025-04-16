import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminContact.css';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/contact',
});

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const contactsPerPage = 10;

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/contacts');
      setContacts(response.data.data);
      setError(null);
    } catch (err) {
      setError(`Failed to load contacts: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/contacts/${id}`, { status });
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status } : contact
      ));
      setSuccessMessage('Status updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  const addNotes = async () => {
    if (!selectedContact || !notes.trim()) return;
    
    try {
      await api.patch(`/contacts/${selectedContact._id}`, { notes });
      
      setContacts(contacts.map(contact => 
        contact._id === selectedContact._id 
          ? { ...contact, notes } 
          : contact
      ));
      
      setSuccessMessage('Notes saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setNotes('');
      setSelectedContact(null);
    } catch (err) {
      setError(`Failed to add notes: ${err.response?.data?.message || err.message}`);
    }
  };

  // Filter and pagination logic
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.phone && contact.phone.includes(searchTerm)) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading contacts...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <p>{error}</p>
      <button onClick={fetchContacts} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="admin-contacts">
      <div className="admin-header">
        <h1>Contact Submissions</h1>
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="contacts-container">
        <div className="contacts-list">
          {filteredContacts.length === 0 ? (
            <div className="no-results">
              No contacts found matching your criteria
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentContacts.map(contact => (
                    <tr key={contact._id} className={`status-${contact.status}`}>
                      <td>{new Date(contact.dateSubmitted).toLocaleDateString()}</td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.subject}</td>
                      <td>
                        <select 
                          value={contact.status}
                          onChange={(e) => updateStatus(contact._id, e.target.value)}
                          className={`status-select status-${contact.status}`}
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          onClick={() => {
                            setSelectedContact(contact);
                            setNotes(contact.notes || '');
                          }}
                          className="view-btn"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {selectedContact && (
          <div className="contact-details">
            <div className="details-header">
              <h2>Contact Details</h2>
              <button 
                onClick={() => {
                  setSelectedContact(null);
                  setNotes('');
                }}
                className="close-btn"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            
            <div className="details-content">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedContact.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedContact.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedContact.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Subject:</span>
                <span className="detail-value">{selectedContact.subject}</span>
              </div>
              {selectedContact.orderNumber && (
                <div className="detail-row">
                  <span className="detail-label">Order #:</span>
                  <span className="detail-value">{selectedContact.orderNumber}</span>
                </div>
              )}
              <div className="message-section">
                <h3 className="message-heading">Message</h3>
                <div className="message-content">{selectedContact.message}</div>
              </div>
              
              {selectedContact.notes && (
                <div className="notes-section">
                  <h3 className="notes-heading">Previous Notes</h3>
                  <div className="notes-content">{selectedContact.notes}</div>
                </div>
              )}
            </div>
            
            <div className="add-notes">
              <h3>Add Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes about this contact..."
                rows="4"
                className="notes-textarea"
              />
              <div className="notes-actions">
                <button 
                  onClick={addNotes} 
                  className="save-btn"
                  disabled={!notes.trim()}
                >
                  Save Notes
                </button>
                <button 
                  onClick={() => {
                    setNotes('');
                    setSelectedContact(null);
                  }} 
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;