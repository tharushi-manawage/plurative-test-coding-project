const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const userModel = require("../models/userModel.js");
const { verifyJWT } = require("../services/jwtService.js");

router.get("/auth", (req, res) => {
    authController.initiateAuth(req, res);
});

router.get("/auth-callback", (req, res) => {
    authController.handleAuthCallback(req, res);
});

router.get("/token", (req, res) => {
    authController.handleToken(req, res);
});

router.get("/api/users", verifyJWT, async (req, res) => {
    try {
        const user = await userModel.getUserById(req.userId);
        if (!user) {
            return res.status(404).send("User not Found");
        }

        res.json({
            id: user.id,
            user_name: user.userName,
            email: user.email,
            profile_picture: user.profilePicture,
        });
    } catch (error) {
        console.error("Error while getting the user");
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;