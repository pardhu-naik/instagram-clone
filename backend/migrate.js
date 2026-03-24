const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Force TLS 1.2 min version globally for this process
require('tls').DEFAULT_MIN_VERSION = 'TLSv1.2';

async function migrate() {
    console.log('Connecting to cloud database with TLS 1.2 pinning...');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
                rejectUnauthorized: true, // Use the CA we just got
                minVersion: 'TLSv1.2' 
            },
            multipleStatements: true
        });

        console.log('Reading schema.sql...');
        const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
        
        console.log('Executing migration...');
        await connection.query(sql);
        console.log('Migration successful! Your cloud database is ready.');
        
        await connection.end();
    } catch (err) {
        console.error('Migration failed:', err.message);
        if (err.code === 'HANDSHAKE_SSL_ERROR') {
            console.log('SSL Handshake failed even with CA. Trying without rejectUnauthorized...');
            try {
                const conn2 = await mysql.createConnection({
                    host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
                    ssl: { rejectUnauthorized: false },
                    multipleStatements: true
                });
                await conn2.query(fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8'));
                console.log('Migration successful (bypassed verification)!');
                await conn2.end();
            } catch (err2) {
                console.error('Final fallback failed:', err2.message);
            }
        }
    }
}

migrate();
