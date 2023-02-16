const db = require('../db');

function getPuzzles(page = 1) {
    const offset = (page - 1) * 10;
    const data = db.query(`SELECT * FROM Puzzle LIMIT ?,?`, [offset, 10]);
    const meta = { page };

    return {
        data,
        meta
    }
}

module.exports = {
    getPuzzles
}