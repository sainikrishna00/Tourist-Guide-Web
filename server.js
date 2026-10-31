const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); 

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const contactData = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, 'contacts.json');
  let contacts = [];

  if (fs.existsSync(filePath)) {
    try {
      contacts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error('Error reading contacts.json:', err);
    }
  }

  contacts.push(contactData);
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

  res.json({ success: 'Thank you! Your message has been received.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${3000}`);
});