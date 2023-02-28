import {describe, expect, test, beforeEach} from '@jest/globals';
import {insertUser} from '../../server/api/signup';
import {db} from '../../server/db';
import * as Crypto from 'crypto';

jest.mock("../../server/db");

describe("Test insertUser", () => {
    var lastID = -1;

    beforeEach(async () => {
        // get the last user id
        await db.get("select max(id) as m from Users", function(err, row) {
            if (err) throw err;
            lastID = row['m'];
        });
    })

    test("Standard user: output of insertUser", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            expect(await insertUser(db, "username", hashedPassword, salt)).toEqual({"id": lastID + 1, "username": "username"});
        });
    });

    test("Standard user: username found in database", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            await insertUser(db, "username", hashedPassword, salt);
            db.get(`select salt as s from Users where id=${lastID+1}`, function(err, row) {
                if (err) throw err;
                expect(row["u"]).toEqual("username");
            });
        });
    })

    test("Standard user: salt found in database", () => {
        var salt = Crypto.randomBytes(16);    // TODO: shouldn't be random, will fix later   
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            await insertUser(db, "username", hashedPassword, salt);
            db.get(`select username as u, salt as s from Users where id=${lastID+1}`, function(err, row) {
                if (err) throw err;
                expect(row["s"]).toEqual(salt);
            });
        });
    })
    
    afterEach(async () => {
        // delete id created in test
        await db.run(`delete from Users where id=${lastID+1}`);
    })
});