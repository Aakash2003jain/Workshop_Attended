import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      // Proceed directly to signup without checking username existence
      const response = await axios.post('http://localhost:5000/signup', { username, password });
      console.log(response.data);
      history.push('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred during signup. Please try again.');
    }
  };
  

  return (
    <div className="container">
      <h1>Sign Up Page</h1>
      <form>
        <label>Username: </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleSignup}>Sign Up</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default SignupForm;
