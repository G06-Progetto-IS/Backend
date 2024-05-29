const express = require('express');
const app = express();
const path = require('path');

// Frontend configuration
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'homepage.html')); // Use path.join to generate the file path
});

app.use(express.json())


// Documentazione
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('swagger.json'); // Assumendo che il tuo file Swagger sia in questa posizione

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//API utente
app.use('/signUp', require('./routes/signUp')) //Swagger
//app.use('/deletePrenotazione', require('./routes/deletePren'));
app.use('/deleteAppuntamento', require('./routes/deleteApp')); //Swagger
app.use('/arrayLibri', require('./routes/getBooks')) //Swagger
//app.use('/Reserve', require('./routes/patchReserve'))
app.use('/Rented', require('./routes/patchRent')) //Swagger
app.use('/getMulta', require('./routes/getMulta')) //Swagger
app.use('/logout', require('./routes/logout')) //Swagger
app.use('/createApp', require('./routes/postApp')) //Swagger
//app.use('/createPren', require('./routes/postPren'))
app.use('/getAppuntamento', require('./routes/getApp')) //Swagger

// API libro
app.use('/getAllBooks', require('./routes/getAllBooks')); //Swagger
app.use('/ricerca', require('./routes/getLibro')); //Swagger
app.use('/book', require('./routes/deleteLibro')); //Swagger
app.use('/filter', require('./routes/Filter')); //Swagger
app.use('/disponibilita', require('./routes/patchDisponibilita')) //Swagger

//API authentication
app.use('/login', require('./routes/login')); //Swagger


//API admin
app.use('/getAll', require('./routes/getAllusers')); //Swagger
app.use('/newLibro', require('./routes/newLibro')); //Swagger
app.use('/deleteUtente', require('./routes/deleteUtente')); //Swagger
app.use('/deleteLibro', require('./routes/deleteLibro')); //Swagger
app.use('/Multa', require('./routes/postMulta')) //Swagger

module.exports = app;




