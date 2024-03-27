const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
   utente_id: {type : Number, required : true},
   data : {type : Date, required : true},
   tipo_app : {type : String, required : true},
   Stato : {type : Boolean}
})

const Appuntamento = mongoose.model("Appuntamento", schema);
module.exports = Appuntamento;