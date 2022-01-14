const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db/index.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from the Express server!');
})

// API ROUTES

app.get('/reviews/:id', (req, res) => {
  // returns list of reviews for particular product
  db.getReviews(req.params.id)
  .then(results => {
    res.send(results);
  })
  .catch(err => {
    res.send('There was an error getting the reviews');
  })
})

app.get('/reviews/meta/:id', (req, res) => {
  // returns review metadata for given product
  db.getReviewsMetadata(req.params.id)
  .then(results => {
    res.send(results);
  })
  .catch(err => {
    res.send('There was an error getting the reviews metadata');
  })
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