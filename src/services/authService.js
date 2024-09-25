const crypto = require("crypto");
const { createToken } = require("./jwtService.js");
const { getOAuthClient, generators } = require("../config/oAuthClient.js");
const authStateModel = require("../models/authStateModel.js");
const userModel = require("../models/userModel.js");
const userTokenModel = require("../models/userTokenModel.js");

async function initiateAuth(req, res) {
    try {
        const state = generators.state();
        const nonce = generators.nonce();
        const codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);

        const authStateData = {
            state,
            nonce: nonce,
            codeChallenge: codeChallenge,
            originUrl: req.originalUrl,
        };

        await authStateModel.saveAuthState(authStateData);

        res.cookie("code_verifier", codeVerifier, {
            httpOnly: true,
            secure: true,
        });

        const oAuthClient = await getOAuthClient();

        const authorizationUrl = oAuthClient.authorizationUrl({
            redirect_uri: process.env.AUTH_CALLBACK_URL,
            scope: 'openid profile email',
            state: state,
            nonce,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            access_type: 'offline',
        });

        res.redirect(authorizationUrl);
    } catch (error) {
        console.error("Error saving auth state: ", error);
        res.status(500).send("Internal Server Error: Couldn't complete authentication");
    }
}

async function handleAuthCallback(req, res) {
    try {
        const { state, code } = req.query;
        
        const authState = await authStateModel.getAuthStateByState(state);
        
        if (!authState) {
            return res.status(400).send("Invalid state parameter");
        }

        const oAuthClient = await getOAuthClient();

        const tokenSet = await oAuthClient.callback(
            process.env.AUTH_CALLBACK_URL,
            { code },
            {
                code_verifier: req.cookies.code_verifier,
                nonce: authState.nonce,
            }
        );

        const userInfo = await oAuthClient.userinfo(tokenSet.access_token);

        let user = await userModel.getUserByEmail(userInfo.email);
        if (!user) {
            user = await userModel.saveUser({
                userName: userInfo.userName,
                email: userInfo.email,
                profilePicture: userInfo.profilePicture,
            });
        }

        const refreshToken = crypto.randomBytes(32).toString("base64");
        const appRefreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const tokenInfo = {
            userId: user.id,
            idpSubjectId: userInfo.sub,
            idpAccessToken: tokenSet.access_token,
            idpAccessTokenExpiresAt: new Date(tokenSet.expires_at * 1000).toISOString(),
            idpRefreshToken: tokenSet.refresh_token,
            idpRefreshTokenExpiresAt: tokenSet.refresh_token_expires_at,
            appRefreshToken: refreshToken,
            appRefreshTokenExpiresAt: appRefreshTokenExpiresAt,
        };

        try {
            await userTokenModel.saveUserToken(tokenInfo);
        } catch (error) {
            console.error("Error aving token: ", error);
        }

        res.cookie("APP_REFRESH_TOKEN", refreshToken, {
            httpOnly: true,
            secure: true,
            expires: appRefreshTokenExpiresAt,
        });

        res.redirect(process.env.TOKEN_URL);
    } catch (error) {
        console.error("Error handling auth callback: ", error);
        res.status(500).send("Internal Server Error");
    }
}

async function handleToken(req, res) {
    const refreshToken = req.cookies.APP_REFRESH_TOKEN;
    if (!refreshToken) {
        return res.status(401).send("Unauthorized: User not authenticated");
    }
    const tokenRecord = await userTokenModel.getUserTokenByAppRefreshToken(refreshToken);

    if (!tokenRecord) {
        return res.status(401).send("Unauthorized");
    }

    if (Date.now() > Date.parse(tokenRecord.app_refresh_token_expires_at)) {
        return res.status(401).send("Unauthorized: Expired token");
    }

    if (Date.now() > Date.parse(tokenRecord.idp_access_token_expires_at)) {
        if (tokenRecord.idp_refresh_token) {
            const oAuthClient = await getOAuthClient();
            try {
                const newTokenSet = await oAuthClient.refresh(
                    tokenRecord.idp_refresh_token
                );

                if (!newTokenSet) {
                    return res.status(401).send("Failed to refresh IDP token");
                }

                const newTokenRecord =
                    await userTokenModel.updateIDPAccessToken(
                        tokenRecord.user_id,
                        newTokenSet
                    );

                await issueJWTToken(newTokenRecord.user_id);
            } catch (error) {
                console.error("Error refreshing IDP token: ", error);
                return res.status(401).send("IDP refresh token is invalid or revoked");
            }
        } else {
            return res.status(401).send("Unauthorized: IDP refresh token is not available");
        }
    } else {
        await issueJWTToken(tokenRecord.user_id);
    }

    async function issueJWTToken(userId) {
        const userInfo = await userModel.getUserById(userId);
        try {
            const jwtToken = await createToken(userInfo);
            res.json({ token: jwtToken });
        } catch (error) {
            console.error("Error occurred while creating JWT token: ", error);
            throw new Error("JWT Creation Error");
        }
    }
}

module.exports = { initiateAuth, handleAuthCallback, handleToken };