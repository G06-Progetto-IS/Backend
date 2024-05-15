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

describe('Suite testing API endpoint: "/Filter"', () => {
    //Jest has detected the following 1 open handle potentially keeping Jest from exiting:
    // errore di timeout
    test('Chiamata API corretta filtro Genre', async() => {
        const outBody = {
            'libri':[
                {
                    titolo: '1984',
                    Author_name: 'George',
                    Author_sur: 'Orwell',
                    Genre: 'Fantascienza',
                    Is_available: true,
                    Grade: null
                },
                {
                    titolo: 'Dune',
                    Author_name: 'Frank',
                    Author_sur: 'Herbert',
                    Genre: 'Fantascienza',
                    Is_available: true,
                    Grade: null
                }
            ],
            success: true
        }

        const response = await request(app)
        .get('/filter')
        .query({
            Genre: 'Fantascienza'
        })
        .expect(200);
        expect(response.body).toStrictEqual(outBody)
    })

    test('Chiamata API corretta filtro Author_sur', async() => {
        const outBody = {
            'libri': [
                {
                    titolo: '1984',
                    Author_name: 'George',
                    Author_sur: 'Orwell',
                    Genre: 'Fantascienza',
                    Is_available: true,
                    Grade: null
                }
            ],
            success: true
        }
        const response = await request(app)
        .get('/filter')
        .query({
            Author_sur: 'Orwell'
        })
        .expect(200);
        expect(response.body).toStrictEqual(outBody);
    })


    test('Chiamta API con filtro non esistente', async() => {
        const response = await request(app)
        .get('/filter')
        .query({
            Voto: '1'
        })
        .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Filtro non selezionato o errato');
    })

    test('Chiamta API con filtro non esistente', async() => {
        const response = await request(app)
        .get('/filter')
        .query({
            Genre: 'Caso'
        })
        .expect(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Nessun libro trovato');
    })

})