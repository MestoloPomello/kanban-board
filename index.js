/**
 * Required External Modules
 */

const database = require("better-sqlite3");
const express = require("express");
const path = require("path");
const pug = require("pug");  


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8080"; // Porta default che usavamo nei lab
const db = new database(`database/database.db`, { verbose: console.log });


/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

db.prepare("CREATE TABLE IF NOT EXISTS columns (titolo TEXT, stato TEXT)").run();
db.prepare("CREATE TABLE IF NOT EXISTS tiles (titolo TEXT, autore TEXT, contenuto TEXT, tipo_messaggio TEXT, tipo_contenuto TEXT)").run();


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});


/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});