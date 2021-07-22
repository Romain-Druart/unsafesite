const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();


app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql');
const { stringify } = require("querystring");

const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '192.168.1.111',
    user     : 'root',
    password : process.env.ROOT_KEY,
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
  console.log(process.env.ROOT_KEY);
  res.render("login");
});

router.post("/login", (req, res) => {
  let request= "SELECT * FROM user where name=? and password= ? "
  console.log(request)
  pool.query(request, [(req.body.uname), (req.body.psw)],(err, data) => {
    if(err) {
      console.error(err);
      res.render("login", {errorMessage:"Erreur interne, reassayer ultérieurement..."});
      return;
    }
    if( data.length > 0){
      res.render("loged", {errorMessage:"Connexion ok"});
    }else{
      res.render("login", {errorMessage:"nom d'utilisateur ou mot de pass incorrect"});
    }
  });
});



app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");