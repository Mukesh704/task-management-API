const express = require("express")
const app = express();

require("dotenv").config();
require("./db");

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Welcome to web app");
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})