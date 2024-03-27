const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    utente_id : {type : Number, required : true},
    nome : {type : String, required : true},
    cognome : {type : String, required : true},
    mail : {type : String, required : true},
    password : {type : String, required : true},
//    libri_in_noleggio : {type : Number, required : true},
//    libri_nolegggiati : { type : Int8Array, required : true},
    libro_id : {type : Number},
    autenticato : {type : Boolean, required : true},
    data_app : {type : Date, required : true},
    tipo_app : {type : String, required : true},
    stato_app : {type : Boolean, required : true}
});

const Utente = mongoose.model("Utente", schema);
module.exports = Utente;