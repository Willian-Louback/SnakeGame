const express = require("express");
const app = express();
const connectToDb = require("./database/db");
const cors = require("cors");

require("dotenv").config({ path: "./secure/.env" });

const port = process.env.PORT || 3100;
const routes = require("./routes/routes");

connectToDb();

app.use(cors({
    origin: "https://snakegamewillian.netlify.app/"
}));

app.use(express.urlencoded({ extended: true })); // Para receber o que vier de um form
app.use(express.json());
app.use(routes);

app.listen(port, () => console.log(`Online na porta ${port}`));