const express = require("express");
const app = express();
const captcha_img = express();
const path = require("path");
const router = express.Router();
const https = require("https");
var crypto = await require('crypto');

const captcha = require("./captcha");

fs = require("fs");

const options = {
  // key: fs.readFileSync("/srv/www/keys/my-site-key.pem"),
  // cert: fs.readFileSync("/srv/www/keys/chain.pem")
};

//, (req, res) => {
//   res.writeHead(200);
//   res.end("hello world\n");
// }
app.use(express.urlencoded({ extended: true }));
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

var hash = crypto.createHash('sha512');
data = hash.update('nodejsera', 'utf-8');
gen_hash= data.digest('hex');
console.log("hash : " + gen_hash);

// captcha
let captcha_image = captcha_img.get("/test/:width?/:height?/", (req, res) => {
  const width = parseInt(req.params.width) || 200;
  const height = parseInt(req.params.height) || 100;
  const { image } = captcha(width, height);
  res.send(`<img class="generated-captcha" src="${image}">`);
  //document.getElementById('captcha_image').src = image;
});


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about", { title: "A propos", message: "Page a propos de ce site" });
});

const captcha_text ="";
const captcha_images ="";

router.get("/login", (req, res) => {
  captcha_img.get("/captcha/:width?/:height?/", (req_1, res_1) => {
    const width = parseInt(req_1.params.width) || 200;
    const height = parseInt(req_1.params.height) || 100;
    const { image, text } = captcha(width, height);
    captcha_text = text; captcha_images = image;
    //res.render("login", {image : captcha_images, text: captcha_text});
  });
  console.log(captcha_text);
  res.render("login", {image : captcha_images, text: captcha_text});
});

router.post("/login", (req, res) => {
  let request= "SELECT * FROM site_user where name=? and password= ? "
  console.log(request)
  const uname_hash = hash.update((req.body.uname), 'utf-8');
  // const psw_hash = hash.update((req.body.psw), 'utf-8')
  gen_hash_uname = uname_hash.digest('hex');
  // gen_hash_psw = psw_hash.digest('hex');
  console.log(gen_hash_uname);
  console.log(gen_hash_psw);
  pool.query(request, [gen_hash_uname, gen_hash_psw],(err, data) => {
    if(err) {
      console.error(err);
      res.render("login", {errorMessage:"Erreur interne, reassayer ultérieurement..."});
      return;
    }
    if( data.length > 0 && req.body.captcha == captcha_image_data.text){
      res.render("loged", {errorMessage:"Connexion ok"});
    }else{
      res.render("login", {errorMessage:"nom d'utilisateur ou mot de pass incorrect"});
    }
  });
});



module.exports = captcha_img;

app.use("/", router);
app.listen(process.env.port || 3000);

https.createServer(options, app).listen(3333)

console.log("Running at Port 3000. Https supposely runing at Port 3333");