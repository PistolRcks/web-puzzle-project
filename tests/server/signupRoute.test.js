import {describe, expect, test} from '@jest/globals';
import {db} from '../../server/db';
import Supertest from 'supertest';

const App = require('../../server/index')
const request = Supertest(App);

jest.mock("../../server/db");

const noUNOrPass = "Error: Username or password not set!";

describe("Test signup route", () => {
    test('Error 400 - no username or password', async () => {
        const res = await request.post('/api/signup').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(noUNOrPass);
    })
    
    test('Error 400 - no password', async () => {
        const res = await request.post('/api/signup').send({
            username: "username"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(noUNOrPass);
    })

    test('Error 400 - no username', async () => {
        const res = await request.post('/api/signup').send({
            password: "password"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(noUNOrPass);
    })

    test('Error 401 - bad username', async () => {
        const res = await request.post('/api/signup').send({
            username: "un$",
            password: "Very1Epic!"
        });
        expect(res.statusCode).toEqual(401);
    })
    
    test('Error 401 - bad password', async () => {
        const res = await request.post('/api/signup').send({
            username: "usernameVeryEpic",
            password: "password"
        });
        expect(res.statusCode).toEqual(401);
    })

    test('Response 200 - happy insertion', async () => {
        const res = await request.post('/api/signup').send({
            username: "usernameVeryCool",
            password: "Very1Epic"
        });
        expect(res.statusCode).toEqual(200);
        
        db.get(`select id from Users where username="usernameVeryCool"`, function(err, row) {
            if (err) throw err;
            expect(row["id"]).toBeDefined(); // we don't know the id; however, it should be something
        });
    })
});