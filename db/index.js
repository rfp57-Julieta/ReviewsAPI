const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'root',
  password: 'password',
  host: '3.101.140.155',
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

  var reviews = `SELECT id,rating,summary,recommend,response,body, TO_TIMESTAMP(date / 1000),reviewer_name,helpfulness FROM reviews_data WHERE product_id=${id} LIMIT 5`;
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
  const now = new Date();
  const convertedTime = Date.parse(now);
  // console.log(now);
  // console.log(typeof convertedTime);
  let addReviewDataQuery = `INSERT INTO reviews_data(id,product_id,rating,date,summary,body,recommend,reviewer_name,reviewer_email) VALUES((SELECT id+1 FROM reviews_data ORDER BY id DESC LIMIT 1),${product_id},${rating},${convertedTime},'${summary}','${body}',${recommend},'${name}','${email}') RETURNING id,product_id`;

  try {
    let result = await pool.query(addReviewDataQuery);
    // console.log(result);
    for (let photo of photos) {
      let addReviewPhotosQuery = `INSERT INTO reviews_photos(id,review_id,url) VALUES((SELECT id+1 FROM reviews_photos ORDER BY id DESC LIMIT 1),${result.rows[0].id},'${photos[photo]}')`;
      let addReviewPhoto = await pool.query(addReviewPhotosQuery);
    }

    for (let characteristic in characteristics) {
      // console.log(characteristic);
      let addCharacteristicQuery = `INSERT INTO characteristic_reviews(id,characteristic_id,review_id,value) VALUES((SELECT id+1 FROM characteristic_reviews ORDER BY id DESC LIMIT 1),${characteristic},${result.rows[0].id},${characteristics[characteristic]})`;
      let addCharacteristicReview = await pool.query(addCharacteristicQuery);
    }
    return result;
  } catch (err) {
    console.log('this is the db catch error:',err.stack);
  }
}

async function markHelpful(review_id) {
  let markHelpfulQuery = `UPDATE reviews_data SET helpfulness=helpfulness+1 WHERE id=${review_id}`;
  let markHelpful = await pool.query(markHelpfulQuery);
  return markHelpful;
}

async function reportReview(review_id) {
  let reportReviewQuery = `UPDATE reviews_data SET reported=true WHERE id=${review_id}`;
  let reportReview = await pool.query(reportReviewQuery);
  return reportReview;
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
  addReview,
  markHelpful,
  reportReview
}
