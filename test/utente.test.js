const {default : mongoose} = require('mongoose');
const request = require('supertest');
require('dotenv').config();
require('../models/utente')

const app = require('../server');
const jwt = require('jsonwebtoken');
const { unchangedTextChangeRange } = require('typescript');
let server;

module.exports = {
    setupFilesAfterEnv : ['./jest.setup.js']
}


beforeAll(async () => {
    jest.setTimeout(30000)
    app.locals.db = await mongoose.connect(process.env.MONGODB_URI);
    server = app.listen(process.env.PORT || 8080);
});

afterAll(async () => {
     mongoose.connection.close();
    server.close();
});

// errore :  TypeError: Cannot read properties of undefined (reading 'close')
describe('suite testing API endpoint "/signUp"', () => {
    const inputBody = {
        nome: "utente prova",
        cognome: "capra",
        mail: "Testcapra@gmail.com",
        password: "abcdefgh!"
    };

    test('Chiamata API corretta', async () => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {
            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Utente creato con successo!');
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    });
});

/*
describe('suite testing API endpoint "/getBooks"', () => {
    Test('test getBooks', async () => {
        const res = await request(app)
        .get('/getBooks?utente_id = 11');
        expect(res.statusCode).toEqueal(200);   
        
    })


})
*/
