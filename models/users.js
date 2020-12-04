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
    },
    update: (callback, user) => {
        const query = escape `
            UPDATE users
            SET
                name = ${user.name}`;
        if(user.new_email) {
            query.append(escape `, email = ${user.new_email}`);
            query.append(escape `, verified_at = NULL `);
        }
        if(user.new_password) {
            query.append(escape `, password = ${user.new_password}`);
        }
        query.append(escape `WHERE id = ${user.id}`);
        
        pool.getConnection(function(err, db) {
            db.query(query, (error, results, fields) => {
                db.release();
                callback({ error, results, fields });
            });
        });
        
    },
    findByEmail: (callback, email) => {
        pool.getConnection(function(err, db) {
            db.query(escape `
                SELECT * FROM users WHERE email = ${email}`,
                (error, users, fields) => {
                    db.release();
                    const user = users[0];
                    callback({ error, user, fields });
                }
            );
        });
    },
    findByID: (callback, id) => {
        pool.getConnection(function(err, db) {
            db.query(escape `
                SELECT * FROM users WHERE id = ${id}`,
                (error, users, fields) => {
                    db.release();
                    const user = users[0];
                    callback({ error, user, fields });
                }
            );
        });
    },
    resetPassword: (callback, user) => {
        const query = escape `
            UPDATE users
            SET
                password = ${user.password}
            WHERE id = ${user.id}`;
        pool.getConnection(function(err, db) {
            db.query(query, (error, results, fields) => {
                db.release();
                callback({ error, results, fields });
            });
        });
    },
    verifyEmail: (callback, user_id) => {
        const query = escape `
            UPDATE users
            SET
                verified_at = CURRENT_TIMESTAMP
            WHERE id = ${user_id}`;
        pool.getConnection(function(err, db) {
            db.query(query, (error, results, fields) => {
                db.release();
                callback({ error, results, fields });
            });
        });        
    }
}