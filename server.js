const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper: read data from file
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// Helper: write data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all cards
app.get('/api/cards', (req, res) => {
  const data = readData();
  res.json(data);
});

// Add a new card
app.post('/api/cards', (req, res) => {
  const data = readData();
  const { name, wishes } = req.body;

  if (!name || !Array.isArray(wishes)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  data.push({ name, wishes });
  writeData(data);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
