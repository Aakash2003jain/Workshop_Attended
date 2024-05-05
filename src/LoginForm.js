// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { username, password })
      .then(response => {
        console.log(response.data);
        if (response.data.success) {
          // Store username in localStorage or sessionStorage
          localStorage.setItem('currentUser', username);

          // Redirect to ConferenceForm on successful login
          history.push('/conference-form');
        } else {
          setError('Invalid credentials. Please check your username and password.');
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        setError('An error occurred during login. Please try again.');
      });
  };

  return (
    <div className="container">
      <h1>Login Page</h1>
      <form>
        <label>Username: </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleLogin}>Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default LoginForm;
