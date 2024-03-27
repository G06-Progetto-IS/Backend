const app = require('./server.js');
const express = require('express');
const mongoose = require('mongoose');
const Libro = require('./models/book');
const Appuntamento = require('./models/appuntamento');
//const invia = require('./invia');


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
app.post('/appuntamento', async (req, res) => {
    try {
        const nuovoLibro = new Libro({
            book_id: req.body.book_id,
            titolo : req.body.titolo,
            Author_name : req.body.Author_name,
            Author_sur : req.body.Author_sur,
            Genre : req.body.Genre,
            Is_available : req.body.Is_available,
            Grade : req.body.Grade,
            scadenza : req.body.scadenza
        });

        const libroInserito = await nuovoLibro.save();
        res.status(201).json(libroInserito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;