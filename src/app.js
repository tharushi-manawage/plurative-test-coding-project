require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");
const { ManageKeys } = require("./config/keys.js");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", routes);
ManageKeys();

module.exports = app;