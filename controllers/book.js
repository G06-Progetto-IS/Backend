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
    let query = {};
    // Aggiungi la ricerca per titolo se è fornito nella richiesta
    if (req.query.titolo) {
        query.titolo = req.query.titolo;
    }
    // Aggiungi la ricerca per author_sur se è fornito nella richiesta
    if (req.query.Author_sur) {
        query.Author_sur = req.query.Author_sur;
    }
    if (req.query.Author_name) {
        query.Author_name = req.query.Author_name;;
    }
    let data =  await libro.find(query).exec()
   
    if (!data) {
        return res.status(404).json({success : false, message : "Libro non trovato"})
    } else {
        const books = [];

        for (const book of data) {
            const { titolo, Author_name, Author_sur, Is_available } = book;
            books.push({
                titolo: titolo,
                Author_name: Author_name,
                Author_sur: Author_sur,
                Is_available: Is_available
            });
        };
        if (books.length === 0) {
            return res.status(404).json({success : false, message : "Libro non trovato"})
        } else {
        return res.status(200).json({success : true, message : "Libro trovato",libri : books});}
    }};

  const Filter = async (req, res) => {

    try {
            let query = {};
            if (req.query.titolo) {
                query.titolo = req.query.titolo;
            }
            // Aggiungi la ricerca per author_sur se è fornito nella richiesta
            if (req.query.Author_sur) {
                query.Author_sur = req.query.Author_sur;
            }
            if (req.query.Genre) {
                query.Genre = req.query.Genre;
            }
        let data = await libro.find(query).exec();
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
    Cancella_libro,
    Ricerca_libro,
    Filter,
    updateDisponibilità
};
