// AllEntries.jsx

import React, { useState, useEffect } from 'react';

const AllEntries = () => {
  const [conferenceEntries, setConferenceEntries] = useState([]);

  useEffect(() => {
    // Fetch all conference entries when the component mounts
    const storedEntries = JSON.parse(localStorage.getItem('conferenceEntries')) || [];
    setConferenceEntries(storedEntries);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="all-entries-container">
      <h2>All Conference Entries</h2>
      <div className="entries-list">
        {conferenceEntries.length > 0 ? (
          <ul>
            {conferenceEntries.map((entry, index) => (
              <li key={index}>
                <p>Conference: {entry.conferenceDetails}</p>
                <p>Place: {entry.place}</p>
                <p>Start Date: {entry.dateStart}</p>
                <p>End Date: {entry.dateEnd}</p>
                <p>Status: {entry.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No conference details found.</p>
        )}
      </div>
    </div>
  );
};

export default AllEntries;
