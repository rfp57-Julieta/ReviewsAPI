require('newrelic');

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


/////// API ROUTES ////////

app.get('/reviews/', (req, res) => {
  // returns list of reviews for particular product
  db.getReviews(req.query.product_id)
  .then(results => {
    res.send(results);
  })
  .catch(err => {
    res.send('There was an error getting the reviews');
  })
})

app.get('/reviews/meta/', (req, res) => {
  // returns review metadata for given product
  db.getReviewsMetadata(req.query.product_id)
  .then(results => {
    res.send(results);
  })
  .catch(err => {
    res.send('There was an error getting the reviews metadata');
  })
})

app.post('/reviews', (req, res) => {
  // add review for given product
  let product_id = req.body.product_id;
  let rating = req.body.rating;
  let summary = req.body.summary;
  let body = req.body.body;
  let recommend = req.body.recommend;
  let name = req.body.name;
  let email = req.body.email;
  let photos = req.body.photos;
  let characteristics = req.body.characteristics;


  // console.log(req.body);
  db.addReview(product_id, rating, summary, body, recommend, name, email, photos, characteristics)
  .then(results => {
    res.status(201).send();
  })
  .catch(err => {
    res.send('There was an error adding a review');
  })
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  // update a review to show it was found helpful
  db.markHelpful(req.body.review_id)
  .then(results => {
    res.status(204).send();
  })
  .catch(err => {
    res.send('There was an error marking a review as helpful');
  })
})

app.put('/reviews/:review_id/report', (req, res) => {
  // update a review to show it was reported
  // action DOES NOT DELETE the review, but review will not be returned in above GET request
  db.reportReview(req.body.review_id)
  .then(results => {
    res.status(204).send();
  })
  .catch(err => {
    res.send('There was an error reporting this review');
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})