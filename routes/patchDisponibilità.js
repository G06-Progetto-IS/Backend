const express = require("express")

const multer = require("multer")
const upload = multer()

const routerApp  = express.Router();
const AppController = require("../controllers/book");


routerApp.patch('/?', upload.none(), AppController.updateDisponibilità);

module.exports = routerApp;