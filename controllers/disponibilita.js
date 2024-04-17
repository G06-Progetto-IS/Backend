libro = require("../models/book")

const updateDisponibilita = async (req, res) => {
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
  updateDisponibilita
}