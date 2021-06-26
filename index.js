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

db.prepare("CREATE TABLE IF NOT EXISTS columns (titolo TEXT PRIMARY KEY, stato TEXT)").run();
db.prepare("CREATE TABLE IF NOT EXISTS tiles (id INTEGER PRIMARY KEY AUTOINCREMENT, titolo TEXT," +
  "autore TEXT, contenuto TEXT, tipo_messaggio TEXT, tipo_contenuto TEXT, titoloColonna TEXT)").run();


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get('/addNewColumn', function(req, res) {
  //req.body contiene i parametri del form in input, in formato JSON
  // title, type
  var data = JSON.parse(req);
  var response = db.prepare('INSERT INTO columns VALUES (?, ?)').run(data.title, data.type);
  res.send(response);
})

app.get('/addNewTile', function(req, res) {
  
})


/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});