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
app.use(express.json());

db.prepare("CREATE TABLE IF NOT EXISTS columns (titolo TEXT PRIMARY KEY, stato TEXT)").run();
db.prepare("CREATE TABLE IF NOT EXISTS tiles (id INTEGER PRIMARY KEY AUTOINCREMENT, titolo TEXT," +
  "autore TEXT, contenuto TEXT, tipo_messaggio TEXT, tipo_contenuto TEXT, titoloColonna TEXT)").run();


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  var qryColumns = db.prepare('SELECT * FROM columns').all();
  var qryTiles = db.prepare('SELECT * FROM tiles').all();
  res.render("index", { title: "Home" , columns: JSON.stringify(qryColumns),
    tiles: JSON.stringify(qryTiles) });
});

app.get('/addNewColumn', function(req, res) {
  try{
    db.prepare('INSERT INTO columns VALUES (?, ?)').run(req.query.colTitle, req.query.colType);
  } catch (error){
    console.log('Attenzione: il nome della colonna dev\'essere univoco.');
  }
  finally{
    var qryColumns = db.prepare('SELECT * FROM columns').all();
    var qryTiles = db.prepare('SELECT * FROM tiles').all();
    res.render("index", { title: "Home" , columns: JSON.stringify(qryColumns),
      tiles: JSON.stringify(qryTiles) });
  }
})

app.get('/addNewTile', function(req, res) {
  db.prepare('INSERT INTO tiles (titolo, autore, contenuto, tipo_messaggio, tipo_contenuto, titoloColonna)' +
    'VALUES (?, ?, ?, ?, ?, ?))').run(req.query.tileTitle, req.query.tileAuthor, req.query.tileContent,
    req.query.tileMessageType, req.query.tileContentType, req.query.tileColumnTitle);

  var qryColumns = db.prepare('SELECT * FROM columns').all();
  var qryTiles = db.prepare('SELECT * FROM tiles').all();
  res.render("index", { title: "Home" , columns: JSON.stringify(qryColumns),
    tiles: JSON.stringify(qryTiles) });
})

app.get('/deleteColumn', function(req, res) {
  db.prepare('DELETE FROM tiles WHERE titoloColonna=?').run(req.query.tileColumnTitle);
  db.prepare('DELETE FROM columns WHERE titolo=?').run(req.query.tileColumnTitle);

  var qryColumns = db.prepare('SELECT * FROM columns').all();
  var qryTiles = db.prepare('SELECT * FROM tiles').all();
  res.render("index", { title: "Home" , columns: JSON.stringify(qryColumns),
    tiles: JSON.stringify(qryTiles) });
})


/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});