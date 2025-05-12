const express = require("express")
const app = express();

require("dotenv").config();
require("./db");

const PORT = process.env.PORT;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.get('/', (req, res) => {
    res.send("Welcome to web app");
})
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})