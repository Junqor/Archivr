import express from "express";
import path from "node:path";
import fs from "node:fs";
import mysql from "mysql2";
import { ResultSetHeader } from "mysql2";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { sqlConfigOptions } from "./configs/sql.config";



const app = express();

const port = 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//body parser
// nodemon
// url and path
 const connection = mysql.createConnection(sqlConfigOptions);

// // simple shit -- TODO: add security
 //await mySqlQuery([query]).then((rows, fields)=>data = rows[0])
 /*
 function mySqlQuery(query : string) {
   return new Promise(function (resolve, reject) {
     connection.query(query, function (err, rows, fields) {
       if (err) reject(err);
       if (rows != undefined) {
         resolve(rows, fields);
       } else {
         resolve(null);
       }
     });
   });
}
*/



async function create(movie: string): Promise<string> {
  return new Promise((resolve, reject) => {
    connection.query<ResultSetHeader>(
      "INSERT INTO Media (title) VALUES (?)",
      [movie],
      (err, res) => {
        if (err) reject(err)
        else
          this.readById(res.insertId)
            .then(l => resolve(l!))
            .catch(reject)
      }
    )
  })
}


app.post("/submit", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", async (req, res) => {
  res.sendFile(__dirname + "/public/signup/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
  await create("test");
});

app.post("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
});

app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`);
});
