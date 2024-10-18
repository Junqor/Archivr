import express from "express"
const app = express()
const port = 8080
//body parser 
// nodemon
// url and path

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`)
})