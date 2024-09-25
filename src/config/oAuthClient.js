const { Issuer, generators } = require("openid-client");

let client;

async function getOAuthClient() {
    if (!client) {
        const googleIssuer = await Issuer.discover("https://accounts.google.com");

        client = new googleIssuer.Client({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uris: [process.env.AUTH_CALLBACK_URL],
            response_types: ['code'],
        });
    }
    return client;
}

module.exports = { getOAuthClient, generators };