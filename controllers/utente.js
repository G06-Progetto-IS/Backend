const appuntamento = require("../models/appuntamento")
const prenotazione = require("../models/prenotazione")

const deleteApp = async (req, res) => {
    let data =  await appuntamento.findOne ({appuntamento_id : req.query.appuntamento_id}).exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Appuntamento non trovato"})
    } else {
        await appuntamento.deleteOne({appuntamento_id: req.query.appuntamento_id});
        return res.status(200).send()
    }
}

const deletePren = async (req, res) => {
    let data =  await prenotazione.findOne ({book_id : req.query.book_id}).exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Prenotazione non trovata"})
    } else {
        await prenotazione.deleteOne({book_id: req.query.book_id});
        return res.status(200).send()
    }
}


module.exports = {
   deleteApp, 
   deletePren
};