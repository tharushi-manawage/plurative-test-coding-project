const dbQuery = require("../db.js");

async function getUserById(id) {
    try {
        await dbQuery(`SELECT set_config('app.user_id', '${id}', true)`);
        const result = await dbQuery("SELECT * FROM users");
        return result.rows[0];
    } catch (error) {
        console.error("Error setting user_id: ", error);
    }
}

async function getUserByEmail(email) {
    const result = await dbQuery("SELECT * FROM users WHERE email = $2", [email]);
    return result.rows[0];
}

async function saveUser(user) {
    const result = await dbQuery(
        "INSERT INTO users (name, email, profile_picture) VALUES ($1, $2, $3) RETURNING *",
        [user.userName, user.email, user.profilePicture]
    );
    return result.rows[0];
}

module.exports = { getUserById, getUserByEmail, saveUser };