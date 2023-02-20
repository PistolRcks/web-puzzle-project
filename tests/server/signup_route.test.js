import {describe, expect, test, beforeAll, afterAll} from '@jest/globals';
import {initDatabase} from '../../server/db';
import {unlinkSync} from 'node:fs';

const App = require('../../server/index');
const Supertest = require('supertest');
const request = Supertest(App);

describe("Test signup route", () => {
    var db;
    const noUNOrPass = "Error: Username or password not set!";

    beforeAll(() => {
        // initialize database
        db = initDatabase('./signup_test_db2.db');
    });

    test('Error 400 - no username or password', async () => {
        const res = await request.post('/api/signup').send({
            test: true
        });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(noUNOrPass);
    })
    
    test('Error 400 - no password', async () => {
        const res = await request.post('/api/signup').send({
            test: true,
            username: "username"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(noUNOrPass);
    })

    test('Error 400 - no username', async () => {
        const res = await request.post('/api/signup').send({
            test: true,
            password: "password"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(noUNOrPass);
    })

    test('Error 401 - bad username', async () => {
        const res = await request.post('/api/signup').send({
            test: true,
            username: "un$",
            password: "Very1Epic!"
        });
        expect(res.statusCode).toEqual(401);
    })
    
    test('Error 401 - bad password', async () => {
        const res = await request.post('/api/signup').send({
            test: true,
            username: "usernameVeryEpic",
            password: "password"
        });
        expect(res.statusCode).toEqual(401);
    })

    test('Response 200 - happy insertion', async () => {
        const res = await request.post('/api/signup').send({
            test: true,
            username: "usernameVeryCool",
            password: "Very1Epic"
        });
        expect(res.statusCode).toEqual(200);
        
        db.get(`select id from Users where username="usernameVeryCool"`, function(err, row) {
            if (err) throw err;
            expect(row["id"]).toBeDefined(); // we don't know the id; however, it should be something
        });
    })

    afterAll(() => {
        // delete database file, throw error if there's an issue
        db.close();
        // TODO (fixme): Eventually, this should delete artifacts... eventually
        // unlinkSync('./signup_test_db2.db');
    })
});