
const prenotazione = require("../models/prenotazione")
const utente = require("../models/utente")
const libro = require("../models/book")
const counter = require("../models/counter")
const aux = require("../auxiliares/check")


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

                if(!aux.validateEmail(newUtente.mail)){
                    res.status(400).json({ error: 'Email non valida' });
                    return;
                }
                if(!aux.checkPw(newUtente.password)){ {
                    res.status(400).json({ error: 'Password non valida' });
                    return;
                }
            }

                newUtente.save((err, data) => {
                    if (err) return res.status(500).json({Error: err});
                    return res.status(201).json({success: true, message: "Utente creato con successo!", data});
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

const deleteApp = async (req, res) => {
    let data =  await utente.findOne ({mail: req.query.mail}).exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Appuntamento non trovato"})
    } else {
        await utente.deleteOne({tipo_app: req.body.tipo_app});
        return res.status(200).json({success : true, message : "Appuntamento eliminato"})
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
        for (let i = 0; i < l.libri_noleggiati.length; i++) {
            let element = l.libri_noleggiati[i];
            let faa = await libro.findOne({ 'book_id': element }).exec();
        
            var p = {
                titolo: faa.titolo,
                Author_sur: faa.Author_sur,
                scadenza: faa.scadenza
            };
        
            libri.push(p);
            console.log(p);
        }

        return res.status(200).json({ libri });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Errore del server" });
    }
}

const Reserve = async (req, res) => {
    try {
        // Attendere la promessa restituita da findOne()
        let user = await utente.findOne({ mail: req.query.mail }).exec();

        if (!user) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }

        // Eseguire updateOne() con i dati da aggiornare
        await utente.updateOne({ mail: req.query.mail }, {
            $set: {
                data_app: req.body.data_app,
                tipo_app: req.body.tipo_app
            }
        });

        return res.status(200).json({ success: true, message: "Appuntamento riservato" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Errore interno del server" });
    }
};

const RentedBooks = async (req, res) => {
    try {
        // Attendere la promessa restituita da findOne()
        let user = await utente.findOne({ mail: req.query.mail }).exec();
        let book = await libro.findOne({book_id: req.body.book_id}).exec();

        var t = {
            libri_noleggiati: user.libri_noleggiati
        }
        if (!user) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }else {
            t.libri_noleggiati.push(book.book_id)
        // Eseguire updateOne() con i dati da aggiornare
            await utente.updateOne({ mail: req.query.mail }, {
                $set: {
                    libri_noleggiati: t.libri_noleggiati,
                
                }
        });

        return res.status(200).json({ success: true, message: "Libro Aggiunto" });
    }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Errore interno del server" });
    }
};

const Multa = async (req, res) => {
    try {
        // Attendere la promessa restituita da findOne()
        let user = await utente.findOne({ mail: req.query.mail }).exec();

        if (!user) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }

        // Eseguire updateOne() con i dati da aggiornare
        await utente.updateOne({ mail: req.query.mail }, {
            $set: {
              multa: req.body.multa
            }
        });

        return res.status(200).json({ success: true, message: "Multa inviata" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Errore interno del server" });
    }
};




module.exports = {
   deleteApp, 
   deletePren,
   getStato,
   getBooks,
   signUp,
   Reserve,
   RentedBooks,
   Multa
};