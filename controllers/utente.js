const appuntamento = require("../models/appuntamento")
const prenotazione = require("../models/prenotazione")
const utente = require("../models/utente")
const libro = require("../models/book")
const counter = require("../models/counter")


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
    let data = await utente.findOne ({book_id : req.query.book_id}).exec();
    
    let pippo = await libro.findOne({book_id : req.query.book_id}).exec();

    const libro = {
        titolo : pippo.titolo,
        Author_sur : pippo.Author_sur,
        scadenza : pippo.scadenza
    };

    if (!data) {
        return res.status(404).json({success : false, message : "Noleggio non trovato"});
    } else {
        await utente.findOne({book_id: req.query.book_id});
        
        return res.status(200).json({succes : true, libro});
    }
}

const getBooks = async (req, res) => {
    try {
        let data = await utente.findOne({ utente_id: req.query.utente_id }).exec();

        if (!data) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }

        var libri = [];
        var l = {
            libri_noleggiati: data.libri_noleggiati
        };

        await Promise.all(l.libri_noleggiati.map(async (element) => {
            let faa = await libro.findOne({ 'book_id': element }).exec(); 

            var p = {
                titolo: faa.titolo,
                Author_sur: faa.Author_sur,
                scadenza: faa.scadenza
            };

            libri.push(p);
            console.log(p);
        }));

        return res.status(200).json({ success: true, libri });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Errore del server" });
    }
}

const signUp = async (req, res) => {
    utente.findOne({mail: req.body.mail}, (err, data) => {
        if(!data){
            counter.findOneAndUpdate(
                {id: "autoval"},
                {"$inc": {"seq": 1}},
                {new: true}, (err, cd) => {
            
                  let seqId;
                  if(cd==null){
                    const newVal = new counter({id: "autoval", seq: 1})
                    newVal.save();
                    seqId = 1
                  }
                  else{
                    seqId = cd.seq
                  }
                  const newUtente = new utente({
                    utente_id : seqId,
                    nome : req.body.nome,
                    cognome : req.body.cognome,
                    mail : req.body.mail,
                    password : req.body.password,
                  })
                  newUtente.save((err, data) => {
                    if (err) return res.status(500).json({Error: err});
                    return res.status(201).json(data);
                })
                }
            )
        }
        else {
            if (err) return res.status(500).json ({Error: err});
            return res.status(409).json({success : false, message:"Utente già presente con questa mail!"});
        }
    })
  }



module.exports = {
   deleteApp, 
   deletePren,
   getStato,
   getBooks,
   signUp
};