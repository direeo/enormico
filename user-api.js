const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Helper: Load users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Helper: Save users
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('User saved:', users[users.length - 1]);
  } catch (err) {
    console.error('Error saving user:', err);
  }
}

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, username, password, phone, dob } = req.body;
  console.log('Register attempt:', { name, email, username });
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    console.log('Email already exists:', email);
    return res.status(409).json({ error: 'Email already exists' });
  }
  if (users.find(u => u.username === username)) {
    console.log('Username already exists:', username);
    return res.status(409).json({ error: 'Username already exists' });
  }
  users.push({ name, email, username, password, phone, dob });
  saveUsers(users);
  res.json({ success: true });
});

// Sign-in endpoint with OTP email
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;
  console.log('Sign-in attempt:', username);
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    console.log('Invalid credentials for:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP for', username, ':', otp);

  // Send OTP to user's email
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'YOUR_GMAIL@gmail.com', // <-- Replace with your Gmail
      pass: 'YOUR_APP_PASSWORD'     // <-- Replace with your Gmail App Password
    }
  });

  try {
    await transporter.sendMail({
      from: 'Enormico <YOUR_GMAIL@gmail.com>',
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });
    console.log('OTP sent to:', user.email);
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ error: 'Failed to send OTP email.' });
  }

  // Save OTP for verification
  const otpsFile = path.join(__dirname, 'otps.json');
  let otps = {};
  if (fs.existsSync(otpsFile)) {
    otps = JSON.parse(fs.readFileSync(otpsFile, 'utf8'));
  }
  otps[username] = { otp, email: user.email, created: Date.now() };
  fs.writeFileSync(otpsFile, JSON.stringify(otps, null, 2));

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`User API server running on http://localhost:${PORT}`);
});
