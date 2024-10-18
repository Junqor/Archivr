import express from "express"
import path from "node:path"
import fs from "node:fs"
import mysql from "mysql2"
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

// simple shit -- TODO: add security
// await mySqlQuery([query]).then((rows, fields)=>data = rows[0])
function mySqlQuery(query){
	return new Promise(function(resolve, reject) {
		connection.query(query, function(err, rows, fields){
			if (err) reject(err)
			if (rows != undefined) {
				resolve(rows,fields)
			}
			else {
				resolve(null)
			}
		})
	})	
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.post("/signup", (req,res) => {
  res.sendFile(__dirname + "/public/signup/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
});

app.post("/login", (req,res) => {
  res.sendFile(__dirname + "/public/login/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
});
app.use(express.static('public'))


app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`)
});