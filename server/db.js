const sqlite3 = require('sqlite3');
const Crypto = require('crypto');

var db = new sqlite3.Database('./puzzle.db');

db.serialize(function() {
  // create the database schema for the todos app
  db.run("CREATE TABLE IF NOT EXISTS User ( \
    user_id INTEGER PRIMARY KEY IDENTITY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");
  
  db.run("CREATE TABLE IF NOT EXISTS Puzzle ( \
    puzzle_id INTEGER PRIMARY KEY IDENTITY, \
    title TEXT NOT NULL, \
    description TEXT \
  )");

  db.run("CREATE TABLE IF NOT EXISTS User Puzzle ( \
    user_id INTEGER, \
    puzzle_id INTEGER, \
    time	INTEGER, \
    progress	NUMERIC NOT NULL COLLATE BINARY, \
    FOREIGN KEY(user_id) REFERENCES User(user_id), \
    FOREIGN KEY(puzzle_id) REFERENCES Puzzle(puzzle_id) \
  )");
  
  // create an initial user (username: alice, password: letmein)
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'alice',
    crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt
  ]);
});

module.exports = db;