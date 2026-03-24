const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'instagram_clone',
    ssl: process.env.DB_HOST ? {
        ca: fs.readFileSync(path.join(__dirname, '..', '..', 'ca.pem')),
        rejectUnauthorized: false
    } : null,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
