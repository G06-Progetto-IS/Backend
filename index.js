const app = require('./server.js');
const express = require('express');
const mongoose = require('mongoose');
//const Libro = require('./models/utente');
//const Appuntamento = require('./models/appuntamento');
//const invia = require('./invia');

require('dotenv').config();

const port = process.env.PORT || 8080;

app.use(express.json());

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

const listener = app.listen(process.env.PORT || 8080, () => {
    console.log('Server in ascolto sulla porta: ' + listener.address().port)
});

// Endpoint API per l'invio di un singolo elemento di tipo libro a MongoDB
/*app.post('/appuntamento', async (req, res) => {
    try {
        const nuovoLibro = new Libro({
            utente_id : req.body.utente_id,
            nome : req.body.nome,
            cognome : req.body.cognome,
            mail : req.body.mail,
            password : req.body.password,
            libri_noleggiati : req.body.libri_noleggiati,
            book_id : req.body.book_id,
            autenticato : req.body.autenticato,
            data_app : req.body.data_app,
            tipo_app : req.body.tipo_app,
            stato_app : req.body.stato_app
        });

        const libroInserito = await nuovoLibro.save();
        res.status(201).json(libroInserito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});*/

module.exports = app;