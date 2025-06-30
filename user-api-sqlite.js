const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'users.db');

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite DB
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) throw err;
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    phone TEXT,
    dob TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS otps (
    username TEXT PRIMARY KEY,
    otp TEXT,
    email TEXT,
    created INTEGER
  )`);
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, username, password, phone, dob } = req.body;
  db.get('SELECT 1 FROM users WHERE email = ? OR username = ?', [email, username], (err, row) => {
    if (row) return res.status(409).json({ error: 'Email or username already exists' });
    db.run('INSERT INTO users (name, email, username, password, phone, dob) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, username, password, phone, dob],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to register user' });
        res.json({ success: true });
      }
    );
  });
});

// Sign-in endpoint with backend OTP
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Send OTP to user's email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'YOUR_GMAIL@gmail.com', // <-- Replace with your Gmail
        pass: 'YOUR_APP_PASSWORD'     // <-- Replace with your Gmail App Password
      }
    });
    transporter.sendMail({
      from: 'Enormico <YOUR_GMAIL@gmail.com>',
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    }, (err, info) => {
      if (err) return res.status(500).json({ error: 'Failed to send OTP email.' });
      // Save OTP in DB
      db.run('REPLACE INTO otps (username, otp, email, created) VALUES (?, ?, ?, ?)',
        [username, otp, user.email, Date.now()],
        (err) => {
          if (err) return res.status(500).json({ error: 'Failed to save OTP.' });
          res.json({ success: true });
        }
      );
    });
  });
});

// OTP verification endpoint
app.post('/api/verify-otp', (req, res) => {
  const { username, otp } = req.body;
  db.get('SELECT * FROM otps WHERE username = ?', [username], (err, row) => {
    if (!row) return res.status(401).json({ error: 'No OTP found. Please login again.' });
    if (Date.now() - row.created > 5 * 60 * 1000) {
      db.run('DELETE FROM otps WHERE username = ?', [username]);
      return res.status(401).json({ error: 'OTP expired. Please login again.' });
    }
    if (row.otp === otp) {
      db.run('DELETE FROM otps WHERE username = ?', [username]);
      return res.json({ success: true, email: row.email });
    } else {
      return res.status(401).json({ error: 'Invalid OTP.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`User API server (SQLite) running on http://localhost:${PORT}`);
});
