import React from 'react';
import { useState } from 'react';
export default function AdminPanel({ show, onHide }) {
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        {/* Add your admin panel content here */}
        <button onClick={onHide}>Close</button>
      </div>
    </div>
  );
}

