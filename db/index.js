const { Pool, Client } = require('pg');


const pool = new Pool({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'reviews'
});

// const getReviews = (id, request, response) => {
//   var reviews = `SELECT * FROM reviews_data WHERE product_id=${id}`;

//   pool.query(reviews, (err, results) => {
//     if (err) {
//       throw err;
//     }
//     console.log(results.rows);
//   })
// }

const getReviews = function(id, cb) {
  var reviews = `SELECT id,rating,summary,recommend,response,body,date,reviewer_name,helpfulness FROM reviews_data WHERE product_id=${id}`;
  var photos = `SELECT id, url FROM reviews_photos WHERE review_id=${id}`;
  pool.query(reviews, (err, results1) => {
    if (err) {
     cb(err, null);
    } else {
      let package = {
        "product": String(id),
        "page": 0,
        "count": 5,
        results: []
      }
      package['results'] = results1.rows;


      // package['results'].forEach((review) => {
      //   review[photos] = []
      // })



      cb(null, package);
    }
  })
}



// pool.connect()
// .then((res) => {
//   console.log('Connected to Postgres successfully!');
// })
// .catch((err) => {
//   console.log(err);
// })

module.exports = {
  getReviews
}