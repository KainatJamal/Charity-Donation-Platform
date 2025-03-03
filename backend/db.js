const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aid_circle',
    password: 'kainat123', // Use environment variable for production
    port: 5432,
});

module.exports = pool;
