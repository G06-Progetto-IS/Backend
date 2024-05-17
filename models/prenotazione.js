// Modello per prenotare un appuntamento per restituire un libro
const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    mail : {type: String, required : true},
    titolo : {type: String, required: true},
    data : {type: Date, required: true},
    tipo_app: {type: String, required: true},
})

const Prenotazione = mongoose.model("Prenotazione", schema);
module.exports = Prenotazione;