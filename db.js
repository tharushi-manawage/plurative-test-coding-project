const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1286290@tM",
    database: "user_info"
})

client.connect((err) => {
    if (err) {
        console.error("Connection Error!", err.stack);
    } else {
        console.log("Connected");
    }
})

module.exports = client;