import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AdminDetails.css'; // Import the CSS file

const AdminDetails = () => {
  const [searchType, setSearchType] = useState('faculty');
  const [searchValue, setSearchValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // New state for the selected date
  const [conferenceDetails, setConferenceDetails] = useState([]);
  const [username, setUsername] = useState('');

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue('');
  };

  const handleValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('currentUser');
    setUsername(storedUsername);
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/search-by-faculty', // Update with your actual server endpoint
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            facultyName: searchType === 'faculty' ? searchValue : null,
            date: searchType === 'startdate' ? (selectedDate ? selectedDate.toISOString() : null) : null,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error fetching data from the server: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData); // Log the response data
  
      // Update the state with the fetched data
      setConferenceDetails(responseData.data || []);
    } catch (error) {
      console.error('Error:', error.message);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <div className="screen-background">
      <div className="admin-container">
        <div className="taskbar">
          <h1 className="webpage-heading">Conference Details Management</h1>
          <p className="username">Logged in as: {username}</p>

        </div>
        <div className="sidebar">
          <p className="sidebar-heading">Options</p>
          <button onClick={() => setSearchType('faculty')} className="sidebar-button">
            Search by Faculty
          </button>
          <button onClick={() => setSearchType('startdate')} className="sidebar-button">
            Search by Start Date
          </button>
        </div>
        <div className="main-content">
          <h2 className="title">Admin Panel</h2>
          <div className="search-container">
            {searchType === 'startdate' && (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select a date"
                className="input"
              />
            )}
            {searchType === 'faculty' && (
              <input
                type="text"
                value={searchValue}
                onChange={handleValueChange}
                placeholder="Enter Faculty Name"
                className="input"
              />
            )}
            <button onClick={handleSearch} className="button">
              Search
            </button>
          </div>
          <div className="details-container">
            {conferenceDetails.length > 0 ? (
              <div className="conference-list">
                <h3 className="subtitle">Conference Details:</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Conference</th>
                      <th>Faculty Name</th>
                      <th>Place</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conferenceDetails.map((entry, index) => (
                      <tr key={index} className="table-row">
                        <td>{entry.conferenceDetails}</td>
                        <td>{entry.facultyName}</td>
                        <td>{entry.place}</td>
                        <td>{new Date(entry.dateStart).toLocaleDateString()}</td>
                        <td>{new Date(entry.dateEnd).toLocaleDateString()}</td>
                        <td>{entry.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-details">No conference details found for the selected criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
