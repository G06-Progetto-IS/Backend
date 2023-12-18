const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    utente_id : {type : Number},
    nome : {type : String},
    cognome : {type : String},
    mail : {type : String},
    password : {type : String},
    libri_in_noleggio : {type : Number},
    libri_nolegggiati : { type : Int8Array},
    autenticato : {type : Boolean}


});
 
const User = mongoose.model("User", schema);