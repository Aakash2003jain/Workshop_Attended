import React, { useState } from 'react';

const AdminPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [conferenceDetails, setConferenceDetails] = useState([]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearch = () => {
    // Retrieve conference details associated with selectedDate from localStorage
    const storedData = JSON.parse(localStorage.getItem('conferenceEntries')) || [];
    const filteredDetails = storedData.filter(
      (item) => item.dateStart === selectedDate || item.dateEnd === selectedDate
    );
    setConferenceDetails(filteredDetails);
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <label htmlFor="dateInput">Enter Date:</label>
      <input
        type="date"
        id="dateInput"
        value={selectedDate}
        onChange={handleDateChange}
        required
      />
      <button onClick={handleSearch}>Search</button>

      {/* Display conference details based on selected date */}
      <div>
        {conferenceDetails.map((detail, index) => (
          <div key={index}>
            <p>Conference Details: {detail.conferenceDetails}</p>
            <p>Place: {detail.place}</p>
            <p>Date Start: {detail.dateStart}</p>
            <p>Date End: {detail.dateEnd}</p>
            <p>Status: {detail.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
