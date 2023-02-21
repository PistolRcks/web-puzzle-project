import {describe, expect, test, beforeAll, afterAll, beforeEach} from '@jest/globals';
import {insertUser} from '../../server/api/signup';
import {initDatabase} from '../../server/db';

const withLocalTmpDir = require('with-local-tmp-dir');
const Crypto = require('crypto');

describe("Test insertUser", () => {
    beforeAll(async () => {
        // init temp dir
        this.resetTempDir = await withLocalTmpDir();
        // initialize database within temp dir
        this.db = initDatabase('signup_test_db.db');
    });

    beforeEach(() => {
        // get the last user id
        this.db.get("select max(id) as m from Users", function(err, row) {
            if (err) throw err;
            this.lastID = row['m'];
        });
    })

    test("Standard user: output of insertUser", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            expect(await insertUser(this.db, "username", hashedPassword, salt)).toEqual({"id": this.lastID + 1, "username": "username"});
        });
    });

    test("Standard user: username found in database", () => {
        var salt = Crypto.randomBytes(16);       
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            await insertUser(this.db, "username", hashedPassword, salt);
            this.db.get(`select salt as s from Users where id=${this.lastID+1}`, function(err, row) {
                if (err) throw err;
                expect(row["u"]).toEqual("username");
            });
        });
    })

    test("Standard user: salt found in database", () => {
        var salt = Crypto.randomBytes(16);    // TODO: shouldn't be random, will fix later   
        Crypto.pbkdf2("password1", salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
            await insertUser(this.db, "username", hashedPassword, salt);
            this.db.get(`select username as u, salt as s from Users where id=${this.lastID+1}`, function(err, row) {
                if (err) throw err;
                expect(row["s"]).toEqual(salt);
            });
        });
    })
    
    afterEach(() => {
        // delete id created in test
        this.db.run(`delete from Users where id=${this.lastID+1}`);
    })

    afterAll(async () => {
        // close database and remove temp dir
        this.db.close();
        await this.resetTempDir();
    })
});