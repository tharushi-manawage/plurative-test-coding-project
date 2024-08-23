const { Pool } = require('pg');

let client = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1286290@tM",
    database: "user_info"
};

const clientConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : client;

const pool = new Pool(clientConfig);

pool.connect((error) => {
    if (error) {
        console.error("Connection Error!", error.stack);
    } else {
        console.log("Connected");
    }
});

module.exports = pool;