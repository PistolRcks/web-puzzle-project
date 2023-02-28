const Express = require('express')
const db = require('../db');

// Select id, title, desc of each puzzle in the database
function getPuzzles(req, res, next) {
    db.all(`SELECT * FROM Puzzle`, (err, rows) => {
        if (err) {
            res.status(400).send('Error in database operation');
        } else {
            res.status(200).send(rows)
        }
    });
}

module.exports = getPuzzles