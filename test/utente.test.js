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


describe('suite testing API endpoint "/signUp"', () => {

    //RICORDARSI DI CAMBIARE MAIL SUL TEST CORRETTA E PASSWORD NON VALIDA ALTRIMENTI ERRORE!

    /*test('Chiamata API corretta', async () => {
        jest.setTimeout(30000); 

        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita
        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        try {
            const inputBody = {
                nome: "utente prova",
                cognome: "capra",
                mail: "Test2@gmail.com",
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
    });*/

    test('Chiamata API con mail già registrata', async() => {
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

describe('suite testing API endpoint "/getBooks"', () => {

    test('Chiamata API corretta', async () => {
        jest.setTimeout(30000);
        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita

        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();
        // Per ora i libri sono senza scadenza, TO DO : completati i test con scadenza  
        const libri =  [
            {
                titolo: "LA Sboobba",
                Author_sur: "BA",
                scadenza: null
            },
            {
                titolo: "AVo",
                Author_sur: "BA",
                scadenza: null
            },
            {
                titolo: "HP thc",
                Author_sur: "BA",
                scadenza: null
            },
            {
                titolo: "HP cbd",
                Author_sur: "BA",
                scadenza: null
            },
            {
                titolo: "HABDJ",
                Author_sur: "Nice Book",
                scadenza: null
            }
        ];
        const outputBody = {libri};
        const res = await request(app)
        .get('/arrayLibri?utente_id=12')
        .expect(200);
        expect(res.body).toEqual(outputBody);
    });

    test('Chiamata API con utente non esistente', async () => {
        jest.setTimeout(30000);
        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita

        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        const libri =  [
        ];
        const outputBody = {libri};
        const res = await request(app)
        .get('/arrayLibri?utente_id=11')
        .expect(404);
        expect(res.body.message).toBe('Utente non trovato');
    });

    test('Chiamata API con array libri vuoto', async () => {
        jest.setTimeout(30000);
        // Assicurati che il server sia in ascolto e la connessione al database sia stabilita

        expect(app).toBeDefined();
        expect(app.locals.db).toBeDefined();

        const libri =  [
        ];
        const outputBody = {libri};
        const res = await request(app)
        .get('/arrayLibri?utente_id=13')
        .expect(200);
        expect(res.body).toEqual(outputBody);
    });
});


describe('suite testing API endpoint "/ricerca"', () => {

    test('Chiamata API corretta con ricerca per cognome autore', async () => {
        
        //ricerca per cognome
        const outBody = {
            'libri':[{
                    titolo:'LA Sboobba',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true
                },
                {
                    titolo:'AVo',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true 
                },
                {
                    titolo:'HP thc',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true
                },{
                    titolo:'HP cbd',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true
                }
            ],
            message : 'Libro trovato',
            success : true
        }
        const res = await request(app)
        .get('/ricerca?Author_sur=BA')
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro trovato')
        expect(res.body).toStrictEqual(outBody);

    });

    test('Chiamata API corretta con nome autore', async() => {
        const outBody = {
            'libri':[{
                    titolo:'LA Sboobba',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true
                },
                {
                    titolo:'AVo',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true 
                },
                {
                    titolo:'HP thc',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true
                },{
                    titolo:'HP cbd',
                    Author_name:'AB',
                    Author_sur:'BA',
                    Is_available: true
                }
            ],
            message : 'Libro trovato',
            success : true
        }
        const res = await request(app)
        .get('/ricerca?Author_sur=BA')
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro trovato')
        expect(res.body).toStrictEqual(outBody);
    });

    test('Chiamata API corretta con titolo libro', async() => {
        const outBody = {
            'libri' :[{
                titolo:'LA Sboobba',
                Author_name:'AB',
                Author_sur:'BA',
                Is_available: true
            }],
            message : 'Libro trovato',
            success : true
        }
        const res = await request(app)
        .get('/ricerca?titolo=LA Sboobba')
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro trovato');
        expect(res.body).toStrictEqual(outBody);
    });

    test('Chiamata API con titolo errato', async () => {
        const res = await request(app)
        .get('/ricerca?titolo=El Primo')
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });

    test('Chiamata API con Author_sur errato', async () => {
        const res = await request(app)
        .get('/ricerca?Author_sur=ABBA')
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });

    test('Chiamata API con Author_name errato', async () => {
        const res = await request(app)
        .get('/ricerca?Author_name=Lukaku')
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });
});

describe('suite testing API endpoint "/Reserve"', () => {

    function today_s_Date() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        return today;
    };

    function yesterday_s_Date () {
        var yesterday = new Date();
        var dd = String(yesterday.getDate()-1).padStart(2, '0');
        var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = yesterday.getFullYear();
        yesterday = yyyy + '-' + mm + '-' + dd;
        return yesterday;
    }

    const inputBody = {
        date_app : today_s_Date,
        tipo_app : 'Prenotazione'
    }

    test('Chiamata API corretta', async () => {
        const res= await request(app)
        .patch('/Reserve?mail=ciar.latano@gmail.com')
        .send(inputBody)
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Appuntamento riservato');
    });

    test('Chiamata API con utente non esistente', async () => {
        const res= await request(app)
        .patch('/Reserve?mail=nonesisto@gmail.com')
        .send(inputBody)
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Utente non trovato');
    });

    test('Chiamata API con data non valida', async () => {
        console.log(yesterday_s_Date());
        const res= await request(app)
        .patch('/Reserve?mail=ciar.latano@gmail.com')
        .send({
            data_app : yesterday_s_Date(),
            tipo_app : 'Prenotazione'
        })
        .expect(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Data non valida');
    });

});

describe('suite testing API endpoint : "/Rented" ', ()=>{

    test('Chiamata API corretta', async () => {
        const inputBody={
            book_id : 22
        }
        const res= await request(app)
        .patch('/Rented?mail=Test1@gmail.com')
        .send(inputBody)
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Libro aggiunto');
    });

    test('Chiamata API utente non esistente', async() => {
        const inputBody={
            book_id : 22
        }
        const res= await request(app)
        .patch('/Rented?mail=nonesisto@gmail.com')
        .send(inputBody)
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Utente non trovato');
    });

    test('Chiamata API input non valido', async () => {
        const inputBody={
            book_id : 'a'
        }
        const res= await request(app)
        .patch('/Rented?mail=nonesisto@gmail.com')
        .send(inputBody)
        .expect(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Errore interno del server');
    });

    test('Chiamata API libro non presente', async () => {
        const inputBody={
            book_id : 404
        }
        const res= await request(app)
        .patch('/Rented?mail=nonesisto@gmail.com')
        .send(inputBody)
        .expect(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Libro non trovato');
    });
    
});