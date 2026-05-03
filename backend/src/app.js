const express = require("express");
const cors = require("cors");
const dataRoute = require("../routes/dataRoute");
const chatRoute = require("../routes/chatRoute");

const app = express();
app.use(cors());
app.use(express.json());


// Allow both standard and stripped paths for local and Netlify
app.use(["/api/data", "/data"], dataRoute);
app.use(["/api/chat", "/chat"], chatRoute);

module.exports = app;