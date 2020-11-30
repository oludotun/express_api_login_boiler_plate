const pool = require('../services/mysql');
const escape = require('sql-template-strings');

module.exports = {
    create: (callback, user) => {
        pool.getConnection(function(err, db) {
            db.query(escape `
                INSERT INTO users (
                    name,
                    email,
                    password
                ) VALUES (
                    ${user.name},
                    ${user.email},
                    ${user.password}
                )`,
                (error, results, fields) => {
                    db.release();
                    callback({ error, results, fields });
                }
            );
        });
    } 
}