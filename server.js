const express = require('express');
const app = express();
const path = require('path');


// Frontend configuration
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'homepage.html')); // Use path.join to generate the file path
});

const tokenChecker = require('./controllers/tokenChecker')

//API utente
app.use('/signUp', require('./routes/signUp'))
app.use('/deletePrenotazione', tokenChecker);
app.use('/deleteAppuntamento', tokenChecker);
app.use('/noleggio', tokenChecker);
app.use('/arrayLibri', require('./routes/getBooks'))
app.use('/Reserve', require('./routes/patchReserve'))
app.use('/Rented', require('./routes/patchRent'))
app.use('/Multa', require('./routes/patchMulta'))

// API libro
app.use('/ricerca', require('./routes/getLibro'));
app.use('/book', require('./routes/deleteLibro'));
app.use('/newLibro', require('./routes/newLibro'));
app.use('/filter', require('./routes/Filter'));
app.use('/disponibilita', require('./routes/patchDisponibilità'))

//API authentication
app.use('/login', require('./routes/login'));


module.exports = app;




