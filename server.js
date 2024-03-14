const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();


// Frontend configuration
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'homepage.html')); // Use path.join to generate the file path
});



module.exports = app;




