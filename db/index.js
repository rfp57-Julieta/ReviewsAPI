const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'reviews'
});

// Get reviews from database for given product
async function getReviews(id) {
  let package = {
    'product': String(id),
    'page': 0,
    'count': 5
  }

  var reviews = `SELECT id,rating,summary,recommend,response,body, TO_TIMESTAMP(date / 1000),reviewer_name,helpfulness FROM reviews_data WHERE product_id=${id}`;
  let review_data = await pool.query(reviews);
  package['results'] = review_data.rows;

  for (let row of review_data.rows) {
    var photos = `SELECT id, url FROM reviews_photos WHERE review_id=${row.id}`;
    // console.log(row.id);
    let photos_data = await pool.query(photos);
    row['photos'] = photos_data.rows;

  }
  return package;
}

// Get review metadata for given product
async function getReviewsMetadata(id) {
  let metadata = {
    'product_id': String(id),
    'ratings': {},
    'recommended': {},
    'characteristics': {}
  }

  let ratings = `SELECT rating,COUNT(rating) FROM reviews_data WHERE product_id=${id} GROUP BY rating ORDER BY rating`;
  let ratingsCount = await pool.query(ratings);

  for (let key of ratingsCount.rows) {
    metadata.ratings[String(key.rating)] = key.count;
  }

  let recommended = `SELECT recommend,COUNT(recommend) FROM reviews_data WHERE product_id=${id} GROUP BY recommend ORDER BY recommend`;
  let recommendedCount = await pool.query(recommended);
  for (let key of recommendedCount.rows) {
    metadata.recommended[key.recommend] = key.count;
  }

  let characteristics = `SELECT id,product_id,name FROM characteristics WHERE product_id=${id}`
  let characteristics_data = await pool.query(characteristics);
  for (let key of characteristics_data.rows) {
    let valueQuery = `(SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_id=${key.id})`
    let characteristics_values = await pool.query(valueQuery);
    // console.log(characteristics_values.rows);
    characteristics_values.rows[0].avg ? metadata.characteristics[key.name] = {
      'id': key.id,
      'value': characteristics_values.rows[0].avg
    } : null;
  }
  // console.log(characteristics_data.rows);
  // console.log(metadata);

  return metadata;
}

// Add a review for the given product
async function addReview(product_id, rating, summary, body, recommend, name, email, photos, characteristics) {
  let addReviewQuery = `INSERT INTO reviews_data(product_id,rating,summary,body,recommend,reviewer_name,reviewer_email) VALUES(${product_id},${rating},${summary},${body},${recommend},${name},${email})`;
}


// pool.connect()
// .then((res) => {
//   console.log('Connected to Postgres successfully!');
// })
// .catch((err) => {
//   console.log(err);
// })

module.exports = {
  getReviews,
  getReviewsMetadata,
  addReview
}

// ORIGINAL getReviews FUNCTION CODE - async issue with queries
// const getReviews = (id, request, response) => {
//   var reviews = `SELECT * FROM reviews_data WHERE product_id=${id}`;

//   pool.query(reviews, (err, results) => {
//     if (err) {
//       throw err;
//     }
//     console.log(results.rows);
//   })
// }

// const getReviews = function(id, cb) {
//   var reviews = `SELECT id,rating,summary,recommend,response,body,date,reviewer_name,helpfulness FROM reviews_data WHERE product_id=${id}`;

//   pool.query(reviews, (err, results1) => {
//     if (err) {
//      cb(err, null);
//     } else {
//       let package = {
//         "product": String(id),
//         "page": 0,
//         "count": 5,
//         results: []
//       }
//       package['results'] = results1.rows;
//       package['results'].forEach((review) => {
//         // console.log(review.id);
//         var photos = `SELECT id, url FROM reviews_photos WHERE review_id=${review.id}`;
//         pool.query(photos, (err, results2) => {
//           if (err) {
//             cb(err, null);
//           } else {
//             console.log(results2.rows);
//             if (results2.rows.length === 0) {
//               review['photos'] = [];
//             } else {
//               review['photos'] = [results2.rows];
//             }
//           }
//         })
//       })
//       cb(null, package);
//     }
//   })
// }