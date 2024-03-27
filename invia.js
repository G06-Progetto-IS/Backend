const express = require('express');
const axios = require('axios');
const app = express();

var date = new Date("2016-05-18T16:00:00Z");

const datoDaInviare = {
  book_id : 7,
  titolo : "ABC",
  Author_name : "Oblak",
  Author_sur : "Surname",
  Genre : "Giallo",
  Is_available : true,
  Grade : 5,
  scadenza : date
  };

axios.post('http://localhost:3001/appuntamento', datoDaInviare)
  .then(response => {
    console.log('Dati inviati con successo:', response.data);
  })
  .catch(error => {
    console.error('Errore durante l\'invio dei dati:', error);
  });

module.exports = app;

