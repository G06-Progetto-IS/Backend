const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
   data : {type : Date, required : true},
   tipo_app : {type : String, required : true},
   Stato : {type : Boolean, required : true}
})

const Appuntamento = mongoose.model("Appuntamento", schema);
module.exports = Appuntamento;