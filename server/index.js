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
  db.getReviews(req.params.id, (err, result) => {
    if (err) {
      console.log('Failed to get data:', err);
      res.status(500).send();
    } else {
      console.log('Got all the reviews');
      res.status(200).send(result);
    }
  });
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