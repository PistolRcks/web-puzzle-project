const Express = require('express')
const db = require('../db');

function getPuzzles(req, res, next) {
    db.each(`SELECT title, description FROM Puzzle`, [], (err, row) => {
        if (err) {
            res.status(500).send(err);
            return next(err);
        } else if (res.headersSent !== true) {
            //console.log(`Title: ${row.title}, Desc: ${row.description}`);
            res.status(200).send(`Title: ${row.title}, Description ${row.description}`);
        }
    });
}

module.exports = getPuzzles