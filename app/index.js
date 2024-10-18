const express = require('express')
const path = require('node:path')
const fs = require('node:fs')
const mysql = require('mysql2')
const app = express()

const port = 8080

app.use(express.static('fileserver'))

app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`)
})