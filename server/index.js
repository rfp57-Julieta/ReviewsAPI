const express = require('express');
const db = require('../db/index.js');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from the Express server!');
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})