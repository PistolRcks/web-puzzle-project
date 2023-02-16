/* eslint-disable no-multi-str */
const Sqlite3 = require('sqlite3');
const Crypto = require('crypto');

var db = new Sqlite3.Database('./server/puzzle.db');

db.serialize(function () {
  // create the database schema for the app
  db.run("CREATE TABLE IF NOT EXISTS User ( \
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");

  db.run("CREATE TABLE IF NOT EXISTS Puzzle ( \
    puzzle_id INTEGER PRIMARY KEY AUTOINCREMENT, \
    title TEXT NOT NULL, \
    description TEXT \
  )");

  db.run("CREATE TABLE IF NOT EXISTS User_Puzzle ( \
    user_id INTEGER, \
    puzzle_id INTEGER, \
    time	INTEGER, \
    progress	NUMERIC NOT NULL COLLATE BINARY, \
    FOREIGN KEY(user_id) REFERENCES User(user_id), \
    FOREIGN KEY(puzzle_id) REFERENCES Puzzle(puzzle_id) \
  )");

  // create an initial user (username: alice, password: letmein)
  var salt = Crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO User (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'alice',
    Crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt
  ]);
});

function query(sql, params) {
  return db.prepare(sql, params);
}

module.exports = {
  db,
  query
};