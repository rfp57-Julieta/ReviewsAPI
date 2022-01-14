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

  var reviews = `SELECT id,rating,summary,recommend,response,body,date,reviewer_name,helpfulness FROM reviews_data WHERE product_id=${id}`;
  let review_data = await pool.query(reviews);
  package['results'] = review_data.rows;

  for (let row of review_data.rows) {
    var photos = `SELECT id, url FROM reviews_photos WHERE review_id=${row.id}`
    // console.log(row.id);
    let photos_data = await pool.query(photos);
    row['photos'] = photos_data.rows;

    // package['results'].push()
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

  let ratings = `SELECT COUNT(*) FROM reviews_data WHERE product_id=${id} GROUP BY rating`;
  let ratingsCount = await pool.query(ratings);

  console.log(ratingsCount);

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
  getReviewsMetadata
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