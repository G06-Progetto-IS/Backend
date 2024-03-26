const libro = require("../models/book")
const Cancella_libro = async (req, res) => {
    let data =  await libro.findOne ({book_id : req.query.book_id}) .exec()

    if (!data) {
        return res.status(404).json({success : false, message : "Libro non trovato"})
    } else {
        await libro.deleteOne({book_id : req.query.book_id});
        return res.status(200).send()
    }
}

module.exports = {
    Cancella_libro
};
