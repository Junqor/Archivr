import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";
const app = express()
const port = 8080
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true}));
//body parser 
// nodemon
// url and path


/* 
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'your_digital_ocean_host',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'archivr_db',
  ssl: { rejectUnauthorized: true }
});
*/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.post("/submit", (req,res) => {
  res.sendFile(__dirname + "/public/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
});
app.use(express.static('fileserver'))


app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`)
});