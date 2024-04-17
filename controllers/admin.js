const utente = require("../models/utente");
const libro = require("../models/book")
const counter = require("../models/counter");

const getAllusers = async (req,res) => {
  utente.find({},(err,data)=>{
      if(data){
          if(data.length === 0){
              return res.status(404).json({success: false, message : "Nessun utente presente"})
          }
           // Map each book to required fields
           const utentes = data.map(utente => ({
            utente_id: utente.utente_id,
            nome: utente.nome,
            cognome: utente.cognome
        }));
        return res.status(200).json({ success: true, utente: utentes });
            } else {
          if(err) return res.status(500).json({Error: err});
          return res.status(404).json({success: false, message : "Nessun utente presente"})
      }
  })
}

const newLibro = async (req, res) => {
  libro.findOne({titolo: req.body.titolo }, (err, data) => {
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
                const newLibro = new libro({
                  book_id : seqId,
                  titolo : req.body.titolo,
                  Author_name : req.body.Author_name,
                  Author_sur : req.body.Author_sur,
                  Genre : req.body.Genre
                })
                newLibro.save((err, data) => {
                  if (err) return res.status(500).json({Error: err});
                  return res.status(201).json(data);
              })
              }
          )
      }
      else {
          if (err) return res.status(500).json ({Error: err});
          return res.status(409).json({success : false, message:"Libro già presente in archivio"});
      }
  })
}

const deleteUtente = async (req, res) => {
  let data =  await utente.findOne ({utente_id: req.query.utente_id}).exec()

  if (!data) {
      return res.status(404).json({success : false, message : "Utente non trovato"})
  } else {
      await utente.deleteOne({utente_id: req.query.utente_id});
      return res.status(200).json({success : true, message : "Utente eliminato"})
  }
}

const updateDisponibilità = async (req, res) => {
  try {
      // Attendere la promessa restituita da findOne()
      let user = await libro.findOne({ titolo: req.query.titolo }).exec();

      if (!user) {
          return res.status(404).json({ success: false, message: "Libro non trovato" });
      }

      // Eseguire updateOne() con i dati da aggiornare
      await libro.updateOne({ titolo: req.query.titolo }, {
          $set: {
            Is_available: req.body.Is_available
          }
      });

      return res.status(200).json({ success: true, message: "Disponibilità aggiornata" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Errore interno del server" });
  }
};



module.exports = {
  getAllusers, 
  newLibro,
  deleteUtente,
  updateDisponibilità
}