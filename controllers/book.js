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

module.exports = {
    Cancella_libro,
    Ricerca_libro,
    newLibro
};
