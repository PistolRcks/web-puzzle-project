const Express = require('express')
const db = require('../db');

function getPuzzles(req, res, next) {
    db.each(`SELECT title, description FROM Puzzle`, [], (err, row) => {
        if (err) {
            res.status(500).send(err);
            return next(err);
        } else if (res.headersSent !== true) {
            res.status(200).send(`Title: ${row.title}, Description ${row.description}`);
        }
    });
}

module.exports = getPuzzles