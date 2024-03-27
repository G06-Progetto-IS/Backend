const express = require('express');
const axios = require('axios');
const app = express();

var date = new Date("2016-05-18T16:00:00Z");

const datoDaInviare = {
  utente_id : 1,
  nome : "Mario",
  cognome : "Mario",
  mail : "Mario",
  password : "Mario",
  book_id : 7,
  autenticato : true,
  data_app : date,
  tipo_app : "Mario",
  stato_app : true
  };

axios.post('http://localhost:3001/appuntamento', datoDaInviare)
  .then(response => {
    console.log('Dati inviati con successo:', response.data);
  })
  .catch(error => {
    console.error('Errore durante l\'invio dei dati:', error);
  });

module.exports = app;

