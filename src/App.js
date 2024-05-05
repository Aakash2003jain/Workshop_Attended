// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ConferenceForm from './Form'; // Ensure this path is correct
import AdminDetails from './AdminDetails'; // Make sure this import is correct

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginForm} />
        <Route exact path="/signup" component={SignupForm} />
        <Route exact path="/conference-form" component={ConferenceForm} />
        <Route exact path="/admin" component={AdminDetails} />

        
      </Switch>
    </Router>
  );
}

export default App;
