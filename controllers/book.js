const libro = require("../models/book")
const counter = require("../models/counter")

const Cancella_libro = async (req, res) => {
    let data =  await libro.findOne ({book_id : req.query.book_id}) .exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Libro non trovato"})
    } else {
        await libro.deleteOne({book_id : req.query.book_id});
        return res.status(200).send()
    }
}

const Ricerca_libro = async (req, res) => {
    let data =  await libro.findOne ({titolo : req.query.titolo}) .exec()
   
    if (!data) {
        return res.status(404).json({success : false, message : "Libro non trovato"})
    } else {
        return res.status(200).send()
    }
}

const newLibro = async (req, res) => {
    libro.findOne({mail: req.body.titolo}, (err, data) => {
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

  const Filter = async (req, res) => {
    try {
        let data = await libro.find({ Genre: req.query.Genre }).exec();
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Nessun libro trovato" });
        } else {
            // Map each book to required fields
            const books = data.map(book => ({
                titolo: book.titolo,
                Author_name: book.Author_name,
                Author_sur: book.Author_sur,
                Genre: book.Genre,
                Is_available: book.Is_available,
                Grade: book.Grade
            }));
            return res.status(200).json({ success: true, libri: books });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Errore interno del server" });
    }
}


module.exports = {
    Cancella_libro,
    Ricerca_libro,
    newLibro,
    Filter
};
