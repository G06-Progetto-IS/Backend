const express = require("express")

const multer = require("multer")
const upload = multer()

const routerLibro  = express.Router();
const libroController = require("../controllers/book");
const routerLibro1 = express.Router();


routerLibro.delete('/?', libroController.Cancella_libro);
routerLibro1.get('/a', libroController.Ricerca_libro);


module.exports = routerLibro;