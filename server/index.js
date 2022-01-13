const express = require('express');
const db = require('../db/index.js');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from the Express server!');
})

// API ROUTES

app.get('/reviews', (req, res) => {
  // returns list of reviews for particular product
  res.send('This is the reviews list route');
})

app.get('/reviews/meta', (req, res) => {
  // returns review metadata for given product
  res.send('This is the reviews meta route');
})

app.post('/reviews', (req, res) => {
  // add review for given product
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  // update a review to show it was found helpful
})

app.put('/reviews/:review_id/report', (req, res) => {
  // update a review to show it was reported
  // action DOES NOT DELETE the review, but review will not be returned in above GET request
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})