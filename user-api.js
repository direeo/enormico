const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Helper: Load users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Helper: Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, username, password, phone, dob } = req.body;
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  users.push({ name, email, username, password, phone, dob });
  saveUsers(users);
  res.json({ success: true });
});

// Sign-in endpoint
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ success: true, user: { name: user.name, email: user.email, username: user.username } });
});

app.listen(PORT, () => {
  console.log(`User API server running on http://localhost:${PORT}`);
});
