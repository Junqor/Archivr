import express from "express"
const app = express()
const port = 8080

app.use(express.static('fileserver'))

app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`)
})