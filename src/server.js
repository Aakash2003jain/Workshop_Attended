const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:3000', // your client's origin
    credentials: true,
  })
);

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workshop',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ success: false, message: 'Error during login' });
    }

    if (result.length > 0) {
      return res.json({ success: true, message: 'Login successful' });
    } else {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});


app.get('/check-username', async (req, res) => {
  const { username } = req.query;

  try {
    const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
    const result = await executeQuery(query, [username]);

    const usernameExists = result[0].count > 0;
    res.json({ exists: usernameExists });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ exists: false, error: 'An error occurred' });
  }
});


app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  console.log('Executing SQL query:', query, [username, password]);

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ success: false, message: 'Error during signup' });
    } else {
      console.log('Signup successful');
      console.log('Insert result:', result);
      res.json({ success: true, message: 'Signup successful' });
    }
  });
});

app.post('/conference-form', (req, res) => {
  const { username, conferenceDetails, facultyName, place, dateStart, dateEnd, status } = req.body;

  if (!username) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  console.log('Username:', username);
  console.log('Conference Details:', conferenceDetails);
  console.log('Faculty Name:', facultyName);
  console.log('Place:', place);
  console.log('Date Start:', dateStart);
  console.log('Date End:', dateEnd);
  console.log('Status:', status);

  const insertQuery =
    'INSERT INTO conference_entries1 (user_id, conferenceDetails, facultyName, place, dateStart, dateEnd, status) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?, ?, ?, ?, ?)';

  db.query(
    insertQuery,
    [username, conferenceDetails, facultyName, place, dateStart, dateEnd, status],
    (err, result) => {
      if (err) {
        console.error('Error during conference form submission:', err);
        console.error('SQL Query:', insertQuery);
        return res.status(500).json({ success: false, message: 'Error during form submission' });
      } else {
        console.log('Conference form submitted successfully!');
        return res.json({ success: true, message: 'Conference form submitted successfully' });
      }
    }
  );
});


app.post('/search-by-faculty', (req, res) => {
  const { facultyName } = req.body;

  if (!facultyName) {
    return res.status(400).json({ success: false, message: 'Faculty name is required for the search.' });
  }

  console.log('Received facultyName:', facultyName);

  const query = 'SELECT * FROM conference_entries1 WHERE facultyName = ?';

  db.query(query, [facultyName], (err, result) => {
    if (err) {
      console.error('Error during search by faculty:', err);
      return res.status(500).json({ success: false, message: 'Error during search by faculty' });
    }

    console.log('Query:', query); // Log the query being executed
    console.log('Parameters:', [facultyName]); // Log the parameters being used in the query
    console.log('Search successful:', result);
    
    // Check the length of the result to provide additional information
    if (result.length === 0) {
      console.log('No data found for the given facultyName:', facultyName);
    }

    return res.json({ success: true, data: result });
  });
});




app.post('/search-by-date', (req, res) => {
  const { selectedDate } = req.body;
  console.log('Received date:', selectedDate);

  const query = 'SELECT * FROM conference_entries1 WHERE DATE(dateStart) = ?';
  console.log('SQL Query:', query);
  console.log('Parameters:', [req.body.selectedDate]);
  console.log('SQL Query:', query);
  console.log('Parameters:', [selectedDate]);

  db.query(query, [selectedDate], (err, result) => {
    if (err) {
      console.error('Error during search by date:', err);
      return res.status(500).json({ success: false, message: 'Error during search by date' });
    }

    console.log('Search successful:', result);

    // Check the length of the result to provide additional information
    if (result.length === 0) {
      console.log('No data found for the given date:', selectedDate);
    }

    return res.json({ success: true, data: result });
  });
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
