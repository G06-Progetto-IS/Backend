const express = require('express');
const axios = require('axios');
const app = express();

const datoDaInviare = {
    book_id: 2,
    titolo: "1984",
    Author_name: "George",
    Author_sur: "Orwell",
    Genre: "Distopia",
    Is_available: true,
    Grade: 4
  };

axios.post('http://localhost:3000/libri', datoDaInviare)
  .then(response => {
    console.log('Dati inviati con successo:', response.data);
  })
  .catch(error => {
    console.error('Errore durante l\'invio dei dati:', error);
  });

module.exports = app;

