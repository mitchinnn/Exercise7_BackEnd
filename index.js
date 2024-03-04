const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.static('public'));

const users = require('./users');

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const user = users.find(user => user.name.toLowerCase() === name);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "Data user tidak ditemukan" });
  }
});

app.post('/users', (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: "Masukkan data yang akan diubah" });
  }
  users.push({ id, name });
  res.json({ message: "User added successfully" });
});

app.post('/upload', (req, res) => {
  const uploadDir = path.join(__dirname, 'public');
  const file = req.files.file;
  file.mv(`${uploadDir}/${file.name}`, err => {
    if (err) {
      return res.status(500).json({ message: "Failed to upload file" });
    }
    res.json({ message: "File uploaded successfully" });
  });
});

app.put('/users/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const { id, newName } = req.body;
  const userIndex = users.findIndex(user => user.name.toLowerCase() === name);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Data user tidak ditemukan" });
  }
  if (!id || !newName) {
    return res.status(400).json({ message: "Masukkan data yang akan diubah" });
  }
  users[userIndex] = { id, name: newName };
  res.json({ message: "User updated successfully" });
});

app.delete('/users/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const userIndex = users.findIndex(user => user.name.toLowerCase() === name);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Data user tidak ditemukan" });
  }
  users.splice(userIndex, 1);
  res.json({ message: "User deleted successfully" });
});

app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "resource tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "terjadi kesalahan pada server" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});