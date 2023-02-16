import {describe, expect, test, beforeAll, afterAll, beforeEach} from '@jest/globals';
import {insertUser} from '../../server/api/signup';
import {initDatabase} from '../../server/db';
import {unlink} from 'node:fs';

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

    test("Standard user", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            expect(insertUser(db, "username", hashedPassword, salt)).toEqual({"id": lastID + 1, "username": "username"});
        });
    });

    afterAll(() => {
        // delete database file, throw error if there's an issue
        unlink('./test_db.db', (err) => {
            if (err) throw err;
        })
    })
});