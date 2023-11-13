const { Pool } = require('pg');

const clientInstance = new Pool({
    connectionString: process.env.CONNECTION_STRING_PG,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = { clientInstance };
