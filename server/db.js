/* eslint-disable no-multi-str */
const Sqlite3 = require("sqlite3");

/**
 * Creates or initializes the database, if it is not already done.
 * @param {String} fp - The filepath location to the initialized or newly created database.
 * @returns {Database} - The sqlite3.Database object representing the database.
 */
function initDatabase(fp) {
  var db = new Sqlite3.Database(fp);

  db.serialize(() => {
    // create the database schema for the app
    db.run(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        hashed_password BLOB,
        salt BLOB
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Puzzle (
        puzzle_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS User_Puzzle (
        user_id INTEGER,
        puzzle_id INTEGER,
        time	INTEGER,
        progress	NUMERIC NOT NULL COLLATE BINARY,
        FOREIGN KEY(user_id) REFERENCES User(user_id),
        FOREIGN KEY(puzzle_id) REFERENCES Puzzle(puzzle_id)
      )
    `);
  });

  const columnsToAdd = {
    User: [
      { name: "profile_picture", typeDef: "BLOB"},
      { name: "profile_picture_top", typeDef: "INTEGER"},
      { name: "profile_picture_left", typeDef: "INTEGER"}
    ]
  }

  for (const table in columnsToAdd) {
    columnsToAdd[table].forEach(column => {
        db.run(`
          ALTER TABLE ${table}
          ADD COLUMN ${column.name} ${column.typeDef}
        `, (err) => { });
    });
  }

  return db;
}

const db = initDatabase("./server/puzzle.db");

module.exports = { db, initDatabase };
