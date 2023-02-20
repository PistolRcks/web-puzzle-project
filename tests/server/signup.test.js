import {describe, expect, test, beforeAll, afterAll, beforeEach} from '@jest/globals';
import {insertUser} from '../../server/api/signup';
import {initDatabase} from '../../server/db';
import {unlink} from 'node:fs';

const Crypto = require('crypto');
const App = require('../../server/index');
const Supertest = require('supertest');
const request = Supertest(App);


describe("Test insertUser", () => {
    var db;
    var lastID;

    beforeAll(() => {
        // initialize database
        db = initDatabase('./test_db.db');
    });

    beforeEach(() => {
        // get the last user id
        db.get("select max(id) as m from Users", function(err, row) {
            if (err) throw err;
            lastID = row['m'];
        });
    })

    test("Standard user: output of insertUser", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            expect(insertUser(db, "username", hashedPassword, salt)).toEqual({"id": lastID + 1, "username": "username"});
        });
    });

    test("Standard user: username found in database", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            insertUser(db, "username", hashedPassword, salt);
            db.get(`select salt as s from Users where id=${lastID+1}`, function(err, row) {
                if (err) throw err;
                expect(row["u"]).toEqual("username");
            });
        });
    })

    test("Standard user: salt found in database", () => {
        var salt = Crypto.randomBytes(16);    // TODO: shouldn't be random, will fix later   
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            insertUser(db, "username", hashedPassword, salt);
            db.get(`select username as u, salt as s from Users where id=${lastID+1}`, function(err, row) {
                if (err) throw err;
                expect(row["s"]).toEqual(salt);
            });
        });
    })
    
    afterEach(() => {
        // delete id created in test
        db.run(`delete from Users where id=${lastID+1}`);
    })

    afterAll(() => {
        // delete database file, throw error if there's an issue
        db.close();
        // TODO (fixme): somehow not unlinking correctly??? idk
        unlink('./test_db.db', (err) => {
            if (err) throw err;
        })
    })
});

describe("Test signup route", () => {
    var db;
    var lastID;

    beforeAll(() => {
        // initialize database
        db = initDatabase('./test_db.db');
    });

    beforeEach(() => {
        // get the last user id
        db.get("select max(id) as m from Users", function(err, row) {
            if (err) throw err;
            lastID = row['m'];
        });
    })

    test('Error 400 - no username or password', async () => {
        const res = await request.post('/api/login').send({});
        expect(res.statusCode).toEqual(400); 
    })
    
    afterEach(() => {
        // delete id created in test
        db.run(`delete from Users where id=${lastID+1}`);
    })

    afterAll(() => {
        // delete database file, throw error if there's an issue
        db.close();
        // TODO (fixme): somehow not unlinking correctly??? idk
        unlink('./test_db.db', (err) => {
            if (err) throw err;
        })
    })
});