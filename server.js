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
app.use('/arrayLibri', tokenChecker)
app.use('/Reserve', require('./routes/patchReserve'))

// API libro
app.use('/ricerca', require('./routes/getLibro'));
app.use('/book', require('./routes/deleteLibro'));
app.use('/newLibro', require('./routes/newLibro'));

//API authentication
app.use('/login', require('./routes/login'));


module.exports = app;




