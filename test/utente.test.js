const {default : mongoose} = require('mongoose');
const request = require('supertest');
require('dotenv').config();

const app = require('../server');
const jwt = require('jsonwebtoken');
const { unchangedTextChangeRange } = require('typescript');
let server;

module.exports = {
    setupFilesAfterEnv : ['./jest.setup.js']
}


beforeAll(async () => {
    jest.setTimeout(20000)
    app.locals.db = await mongoose.connect(process.env.MONGODB_URI);
    server = app.listen(process.env.PORT || 8080);
});

afterAll(async () => {
     mongoose.connection.close();
    server.close();
});

describe ('suite testing API endpoint "/signUp"', () => {
    const inputBody = {
        nome : "utente prova",
        cognome : "capra",
        mail : "Testcapra@gmail.com",
        password : "abcdefgh!"
    }

test('Chiamata API corretta:', async() => {
    const response = await request(app)
       .post('/signUp')
       .send(inputBody)
       .expect(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Utente creato con successo!');
})



});

