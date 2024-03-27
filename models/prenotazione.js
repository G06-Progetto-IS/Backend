const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    utente_id : {type: Number, required : true},
    book_id : {type: Number, required: true},
    data : {type: Date, required: true} 
})

const Prenotazione = mongoose.model("Prenotazione", schema);
module.exports = Prenotazione;