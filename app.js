const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const https = require("https");
fs = require("fs");

const options = {
  key: fs.readFileSync("/srv/www/keys/my-site-key.pem"),
  cert: fs.readFileSync("/srv/www/keys/chain.pem")
};

app.use(express.urlencoded({ extended: true }), (req, res) => {
  res.writeHead(200);
  res.end("hello world\n");
});
const mysql = require('mysql');
const { stringify } = require("querystring");

const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'unsafesite_db',
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
  let request= "SELECT * FROM site_user where name=? and password= ? "
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

https.createServer(options, app).listen(3333)

console.log("Running at Port 3000. Https runing at Port 3333");