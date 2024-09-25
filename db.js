const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// pool.connect((error) => {
//     if (error) {
//         console.error("Connection Error!", error.stack);
//     } else {
//         console.log("Connected");
//     }
// });

async function dbQquery(query, params) {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result;
    } finally {
        client.release();
    }
}

module.exports = dbQquery;