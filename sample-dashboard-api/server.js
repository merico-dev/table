const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db');
const app = express()
const port = 31200

require('dotenv').config({ path: path.join(__dirname, '.env') });

db.init()

app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:32000',
}))

app.get('/ping', (req, res) => {
  res.send('pong 1')
})

app.post('/query', async (req, res, next) => {
  try {
    console.log(req.body)
    const rows = await db.query(req.body.sql);
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
