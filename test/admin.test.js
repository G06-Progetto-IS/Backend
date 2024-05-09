const {default : mongoose} = require('mongoose');
const request = require('supertest');
require('dotenv').config();


const app = require('../server');
const jwt = require('jsonwebtoken');
const { unchangedTextChangeRange } = require('typescript');
let server = app.listen(process.env.PORT || 8080);


module.exports = {
    setupFilesAfterEnv : ['./jest.setup.js']
}


beforeAll(async () => {
    jest.setTimeout(30000)
    app.locals.db = mongoose.connect(process.env.MONGODB_URI);
});


afterAll(async () => {
    mongoose.connection.close();
    server.close();
});



// API di utente, usata qua per ora per scopi di syncrho del testing 
describe('suite testing API endpoint "/signUp"', () => {

    test('Chiamata API corretta', async () => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {
            const inputBody = {
                nome: "Ste",
                cognome: "Gir",
                mail: "ste.gir@gmail.com",
                password: "abcdefgh!"
            };

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

    test ('Chiamata API con mail già registrata', async() => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test1@gmail.com",
                password: "abcdefgh!"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Utente già presente con questa mail!');
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })

    test('Chiamata API con mail non valida', async() => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test1@",
                password: "abcdefgh!"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(400);
            expect(response.body).toEqual({error: 'Email non valida'});
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })

    test('Chiamata API con password non valida', async() => {
        //La password deve essere lunga almeno 8 caratteri e contenere un carattere speciale
        // es : password! è valida mentre password no!
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {

            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test3@gmail.com",
                password: "password"
            };

            const response = await request(app)
                .post('/signUp')
                .send(inputBody)
                .expect(400);
            expect(response.body).toEqual({error: 'Password non valida'});
        } catch (error) {
            // Gestisci eventuali errori nell'esecuzione della richiesta
            console.error('Errore durante la chiamata API:', error);
            throw error;
        }
    })
});

describe('suite testing API endpoint "/getAll"', () => {
    test('Chiamata corretta API', async () => {
        const response = await request(app)
        .get('/getAll');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    })
})

describe ('Suite testing API endpoint "/newLibro"', () => {
    /*test('Chiamata API corretta - Nuovo Libro', async () => {
        const response = await request(app)
            .post('/newLibro')
            .send({
                titolo: 'I pilastri della terra',
                Author_name: 'Ken',
                Author_sur: 'Follet',
                Genre: 'Dramma'
            });
    
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Libro aggiunto');
    });*/
    
    test('Chiamata API corretta - Libro già presente', async () => {
        const response = await request(app)
            .post('/newLibro')
            .send({
                titolo: 'Dune',
                Author_name: 'Frank',
                Author_sur: 'Herbert',
                Genre: 'Fantascienza'
            });
    
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Libro già presente in archivio');
    });
})

describe ('Suite testing API endpoint "/deleteUtente"', () => {
    test('Chiamata corretta API',async() => {
        const response = await request(app)
        .delete('/deleteUtente?mail=ste.gir@gmail.com')
        .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Utente eliminato');
    })
})