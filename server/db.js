/* eslint-disable no-multi-str */
const Sqlite3 = require("sqlite3");

/**
 * Creates or initializes the database, if it is not already done.
 * @param {String} fp - The filepath location to the initialized or newly created database.
 * @param {Array<Object<String>>} puzzles - An array of Puzzle objects to insert into the database.
 *  They should be formatted as:
 *  ```js
 *  {
 *    title: "The title of the puzzle",
 *    description: "The description of the puzzle"
 *  }
 *  ```
 *  Puzzle objects are upserted into the database as they appear in the Array (with the ID of the puzzle being the index in the array + 1)
 * @returns {Database} - The sqlite3.Database object representing the database.
 */
function initDatabase(fp, puzzles) {
  const db = new Sqlite3.Database(fp);

  db.serialize(() => {
    // create the database schema for the app
    db.run(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        hashed_password BLOB,
        salt BLOB, 
        oauth_id TEXT UNIQUE 
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

    addColumns(db);

    // upsert puzzles
    for (let i = 0; i < puzzles.length; i++) {
      const puzzle = puzzles[i];
      // if the puzzle with the id exists, update instead of insert (which is why it's called "upsert")
      db.run(
        `INSERT INTO Puzzle (puzzle_id, title, description)
        VALUES (?, ?, ?)
        ON CONFLICT(puzzle_id) DO UPDATE SET
          title=excluded.title,
          description=excluded.description 
        `,
        [i + 1, puzzle.title, puzzle.description],
        function (err) {
          // catch errors if they happen
          if (err) console.error(err);
        }
      );
    }
  });

  return db;
}

/**
 * Adds any columns not in includued when initializing the database.
 * This allows developers to not delete their existing database in order to add new columns.
 * @param {Sqlite3.Database} db - the database
 */
const addColumns = (db) => {
  const columnsToAdd = {
    User: [
      { name: "oauth_id", typeDef: "TEXT"},
      { name: "profile_picture", typeDef: "BLOB"},
      { name: "profile_picture_top", typeDef: "INTEGER"},
      { name: "profile_picture_left", typeDef: "INTEGER"}
    ]
  };

  for (const table in columnsToAdd) {
    columnsToAdd[table].forEach(column => {
        db.run(`
          ALTER TABLE ${table}
          ADD COLUMN ${column.name} ${column.typeDef}
        `, (err) => { });
    });
  }
}

// Puzzle makers! Put your puzzle objects in here!
const db = initDatabase("./server/puzzle.db", [
  {
    // Puzzle 1
    title: "Simon Says",
    description:
      "Let's get started! This puzzle will help familiarize you with Web Puzzle Project's puzzle style and UI.\
      Follow the steps to find the hidden solution!",
  },
]);

module.exports = { db, initDatabase };
