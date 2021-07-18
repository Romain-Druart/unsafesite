const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();


app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'monsite',
    debug    :  false
});


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about", { title: "A propos", message: "Page a propos de ce site" });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  let request= "SELECT * FROM site_user where name='"+req.body.uname+"' and password='"+req.body.psw+"';"
  console.log(request)
  pool.query(request,(err, data) => {
    if(err) {
      console.error(err);
      res.render("login", {errorMessage:"Erreur interne, reassayer ultérieurement..."});
      return;
    }
    if( data.length > 0){
      res.render("login", {errorMessage:"Connexion ok"});
    }else{
      res.render("login", {errorMessage:"nom d'utilisateur ou mot de pass incorrect"});
    }
  });
});



app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");