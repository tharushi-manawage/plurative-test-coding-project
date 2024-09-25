const dbQuery = require("../db.js");

async function getValidPrivateKey() {
    const { rows } = await dbQuery(
        `SELECT private_key 
        FROM signing_key 
        WHERE expires_at > NOW() 
        AND is_revoked = FALSE 
        ORDER BY expires_at DESC 
        LIMIT 1`
    );
    return rows[0];
}

async function getValidPublicKey() {
    const { rows } = await dbQuery(
        `SELECT public_key 
        FROM signing_key 
        WHERE expires_at > NOW() 
        AND is_revoked = FALSE 
        ORDER BY expires_at DESC 
        LIMIT 1`
    );
    return rows[0];
}

async function insertSigningKey(privateKeyPEM, publicKeyPEM, expiresAt) {
    await dbQuery(
        `INSERT INTO signing_key (private_key, public_key, expires_at) VALUES ($1, $2, $3)`,
        [privateKeyPEM, publicKeyPEM, expiresAt]
    );
}

module.exports = { getValidPrivateKey, getValidPublicKey, insertSigningKey };