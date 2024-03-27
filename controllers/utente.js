const appuntamento = require("../models/appuntamento")
const deleteApp = async (req, res) => {
    let data =  await appuntamento.findOne ({utente_id : req.query.utente_id}).exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Utente non trovato"})
    } else {
        await appuntamento.deleteOne({utente_id: req.query.utente_id});
        return res.status(200).send()
    }
}



module.exports = {
   deleteApp
};