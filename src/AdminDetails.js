import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './AdminDetails.css'; // Import the CSS file

const AdminDetails = () => {
  const [searchType, setSearchType] = useState('faculty');
  const [searchValue, setSearchValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
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
      let searchParam;
      let endpoint;
  
      if (searchType === 'faculty') {
        searchParam = searchValue;
        endpoint = 'http://localhost:5000/search-by-faculty';
      } else if (searchType === 'startdate' && selectedDate) {
        // Format the selectedDate to a string in the format 'YYYY-MM-DD'
        searchParam = selectedDate.toISOString().split('T')[0];
        endpoint = 'http://localhost:5000/search-by-date';
      } else {
        console.error('Invalid search type or missing parameters');
        return;
      }
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedDate: searchType === 'startdate' ? (selectedDate ? searchParam : null) : null,
          facultyName: searchType === 'faculty' ? searchParam : null,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching data from the server: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
  
      let filteredDetails = responseData.data || [];
  
      if (searchType === 'startdate' && selectedDate) {
        // Filter entries with the selected date
        filteredDetails = filteredDetails.filter(
          (entry) =>
            new Date(entry.dateStart).toISOString().split('T')[0] === searchParam ||
            new Date(entry.dateEnd).toISOString().split('T')[0] === searchParam
        );
      }
  
      setConferenceDetails(filteredDetails);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  
  

  return (
    <div className="screen-background">
      <div className="admin-container">
        <div className="taskbar">
          <img src="/KLE-Tech-University-Logo.webp" alt="Logo1" className="logo-image1"/>
          <h1 className="webpage-heading">Conference Details Management</h1>
          <div className='log'>
            <img src="/person1.png" alt="Logo2" className="logo-image" />
            <p className="username">Logged in as: {username}</p>
          </div>

        </div>
        <div className="sidebar">
          <h2 className="sidebar-heading">Admin Pannel Options</h2>
          <button onClick={() => setSearchType('faculty')} className="sidebar-button">
            Search by Faculty
          </button>
          <button onClick={() => setSearchType('startdate')} className="sidebar-button">
            Search by Start Date
          </button>
        </div>
        <div className="main-content">
          <div className="search-container">
            {searchType === 'startdate' && (
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
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

