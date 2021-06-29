/**
 * Required External Modules
 */

const database = require("better-sqlite3");
const express = require("express");
const path = require("path");
const { debugPort } = require("process");
const pug = require("pug");  
const fs = require("fs");
const multer = require("multer");


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8080"; // Porta default che usavamo nei lab
const db = new database(`database/database.db`, { verbose: console.log });

const upload = multer({
  dest: "/images"
});


/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded());

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
    res.redirect('/');
  }
})

app.post('/addNewTile', upload.single("tileContentImage"), (req, res) => {
  if (req.body.tileContentType === 'testo')
    var content = req.body.tileContentText;
  else {
    var content = "img" + req.body.tileTitle + path.extname(req.file.originalname).toLowerCase();
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./images/img" + req.body.tileTitle
      + path.extname(req.file.originalname).toLowerCase());
    fs.rename(tempPath, targetPath, err => { });
  }
  console.log(content);
  db.prepare('INSERT INTO tiles (titolo, autore, contenuto, tipo_messaggio, tipo_contenuto, titoloColonna) ' +
    'VALUES (?, ?, ?, ?, ?, ?)').run(req.body.tileTitle, req.body.tileAuthor, content,
    req.body.tileMessageType, req.body.tileContentType, req.body.tileColumnTitle);

  res.redirect('/');
})

app.get('/deleteColumn', function(req, res) {
  db.prepare('DELETE FROM tiles WHERE titoloColonna=?').run(req.query.tileColumnTitle);
  db.prepare('DELETE FROM columns WHERE titolo=?').run(req.query.tileColumnTitle);

  res.redirect('/');
})

app.get('/editColumn', function(req, res) {
  try{
    db.prepare('UPDATE columns SET titolo=?, stato=? WHERE titolo=?')
      .run(req.query.columnTitle, req.query.columnState, req.query.oldColumnTitle);
    db.prepare('UPDATE tiles SET titoloColonna=? WHERE titoloColonna=?')
      .run(req.query.columnTitle, req.query.oldColumnTitle);
  } catch (error){
    console.log('Attenzione: il nome della colonna dev\'essere univoco.');
  }
  finally{
    res.redirect('/');
  }
})

app.post('/editTile', upload.single("tileContentImage"), (req, res) => {
  if (req.body.tileContentType === 'testo')
    var content = req.body.tileContent;
  else {
    var content = "img" + req.body.tileTitle + path.extname(req.file.originalname).toLowerCase();
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./images/img" + req.body.tileTitle
     + path.extname(req.file.originalname).toLowerCase());
    fs.rename(tempPath, targetPath, err => { });
  }
  db.prepare('UPDATE tiles SET titolo=?, autore=?, contenuto=?, tipo_messaggio=?, titoloColonna=? ' 
      + 'WHERE id=?').run(req.body.tileTitle, req.body.tileAuthor, content,
      req.body.tileMessageType, req.body.tileColumnSelect, req.body.id);

  res.redirect('/');
})

app.get('/deleteTile', function(req, res) {
  db.prepare('DELETE FROM tiles WHERE id=?').run(req.query.tileID);

  res.redirect('/');
})

app.get("/loadImage", (req, res) => {
  res.sendFile(path.join(__dirname, "./images/" + req.query.imageName));
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});