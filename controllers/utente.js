const appuntamento = require("../models/appuntamento")
const prenotazione = require("../models/prenotazione")
const stato_noleggi = require("../models/utente")

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

const getStato = async (req, res) => {
    let data = await stato_noleggi.findOne ({book_id : req.query.book_id}).exec();
    
    const libro = {
        titolo : req.body.titolo,
        Author_sur : req.body.Author_sur,
        scadenza : req.body.scadenza
    };

    if (!data) {
        return res.status(404).json({success : false, message : "Prenotazione non trovata"});
    } else {
        await stato_noleggi.findOne({book_id: req.query.book_id});

        return res.status(200).json({succes : true, libro});
    }
}

module.exports = {
   deleteApp, 
   deletePren,
   getStato
};