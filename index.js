const express = require("express");
const app = express();
const path = require("path");
const connectToDb = require("./database/db");

require("dotenv").config({ path: "./secure/.env" });

const port = process.env.PORT || 3100;
const routes = require("./routes/routes");

connectToDb();

app.use(express.static(path.join(__dirname, "public"), {
    maxAge: 300
})); // Autorizando o uso da pasta public

app.use(express.urlencoded({ extended: true })); // Para receber o que vier de um form
app.use(routes);
app.listen(port, () => console.log(`Online na porta ${port}`));