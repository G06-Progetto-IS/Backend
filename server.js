const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();


// Frontend configuration
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'homepage.html')); // Use path.join to generate the file path
});


app.use('/book', require('./routes/deleteLibro'));
app.use('/utente', require('./routes/deleteApp'));
app.use('/prenotazione', require('./routes/deletePren'));
app.use('/ricerca', require('./routes/getLibro'));
app.use('/noleggio', require('./routes/getStato'));
app.use('/libri', require('./routes/getBooks'))

module.exports = app;




