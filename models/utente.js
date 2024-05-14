const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    utente_id : {type : Number, required : true},
    nome : {type : String, required : true},
    cognome : {type : String, required : true},
    mail : {type : String, required : true},
    password : {type : String, required : true},
    libri_noleggiati : {type : Array, default: null},
    n_libri : {type : Number, default: null},
    autenticato : {type : Boolean, default: null},
    data_app : {type : Date, default: null},
    tipo_app : {type : String, default: null},
    stato_app : {type : Boolean, default: null},
    multa : {type : Number, default: null}
});

const Utente = mongoose.model("Utente", schema);
module.exports = Utente;