import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './ConferenceForm.css';

const ConferenceForm = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [conferenceDetails, setConferenceDetails] = useState('');
  const [place, setPlace] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [status, setStatus] = useState('Invited');
  const [facultyName, setFacultyName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('currentUser');
    setUsername(storedUsername);
  }, []);

  const handleConferenceDetails = (e) => {
    setConferenceDetails(e.target.value);
    setSubmitted(false);
  };

  const handleFacultyName = (e) => {
    setFacultyName(e.target.value);
    setSubmitted(false);
  };

  const handlePlace = (e) => {
    setPlace(e.target.value);
    setSubmitted(false);
  };

  const handleDateStart = (e) => {
    setDateStart(e.target.value);
    setSubmitted(false);
  };

  const handleDateEnd = (e) => {
    setDateEnd(e.target.value);
    setSubmitted(false);
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conferenceDetails === '' || place === '' || dateStart === '' || dateEnd === '' || facultyName === '') {
      setError(true);
      setSubmitted(false);
    } else {
      try {
        await axios.post('http://localhost:5000/conference-form', {
          username,
          conferenceDetails,
          facultyName,
          place,
          dateStart,
          dateEnd,
          status
        });

        setError(false);
        setSubmitted(true);
        setInfoSaved(true);
        console.log('Details submitted successfully!');
        alert('Details submitted successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error saving conference details:', error);
        setError(true);
        setSubmitted(false);
      }
    }
  };

  const successMessage = () => (
    <div className="success-message" style={{ display: infoSaved ? '' : 'none' }}>
      <h1>Information saved!</h1>
    </div>
  );

  const errorMessage = () => (
    <div className="error-message" style={{ display: error ? '' : 'none' }}>
      <h1>Please enter all the fields</h1>
    </div>
  );

  const handleAdminClick = () => {
    history.push('/admin');
  };

  return (
    <div>
      {/* Taskbar */}
      <div className="taskbar">
        <img src="/KLE-Tech-University-Logo.webp" alt="Logo" className="logo-image1" />
        <h2 className="title">Enter Conference Details</h2>
        <div className='log'>
            <img src="/person1.png" alt="Logo2" className="logo-image" />
            <p className="username">Logged in as: {username}</p>
          </div>
      </div>

      {/* Conference Form */}
      <div className="form-container">
        
        <form onSubmit={handleSubmit} className="details-form">
          <div className="form-group">
            <label htmlFor="conferenceDetails">Conference Details:</label>
            <input
              type="text"
              id="conferenceDetails"
              name="conferenceDetails"
              value={conferenceDetails}
              onChange={handleConferenceDetails}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="facultyName">Faculty Name:</label>
            <input
              type="text"
              id="facultyName"
              name="facultyName"
              value={facultyName}
              onChange={handleFacultyName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="place">Place:</label>
            <input
              type="text"
              id="place"
              name="place"
              value={place}
              onChange={handlePlace}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateStart">Date Start:</label>
            <input
              type="date"
              id="dateStart"
              name="dateStart"
              value={dateStart}
              onChange={handleDateStart}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateEnd">Date End:</label>
            <input
              type="date"
              id="dateEnd"
              name="dateEnd"
              value={dateEnd}
              onChange={handleDateEnd}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Invited/Deputed:</label>
            <select id="status" name="status" value={status} onChange={handleStatus}>
              <option value="Invited">Invited</option>
              <option value="Deputed">Deputed</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="button">
              Submit
            </button>
          </div>
        </form>
        <button type="button" onClick={handleAdminClick} className="admin-btn">
              Admin
        </button>
      </div>
    </div>
  );
};

export default ConferenceForm;