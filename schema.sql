DROP TABLE IF EXISTS reviews_data CASCADE;
DROP TABLE IF EXISTS reviews_photos;
DROP TABLE IF EXISTS characteristic_reviews;
DROP TABLE IF EXISTS characteristics;

CREATE TABLE reviews_data (
  id INT PRIMARY KEY NOT NULL,
  product_id INT,
  rating INT,
  date BIGINT,
  summary VARCHAR(255),
  body TEXT,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  response VARCHAR(255),
  helpfulness INT
);

CREATE TABLE reviews_photos (
  id INT PRIMARY KEY NOT NULL,
  review_id INT references reviews_data(id),
  url VARCHAR(255)
);

CREATE TABLE characteristics (
  id INT PRIMARY KEY NOT NULL,
  product_id INT,
  name VARCHAR(255)
);

CREATE TABLE characteristic_reviews (
  id INT PRIMARY KEY NOT NULL,
  characteristic_id INT references characteristics(id),
  review_id INT references reviews_data(id),
  value INT
);

\COPY reviews_data from '/Users/edwardpak/Desktop/hackreactor/System-Design-Capstone/ReviewsAPI/reviews.csv' DELIMITER ',' CSV HEADER;

\COPY reviews_photos from '/Users/edwardpak/Desktop/hackreactor/System-Design-Capstone/ReviewsAPI/reviews_photos.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics from '/Users/edwardpak/Desktop/hackreactor/System-Design-Capstone/ReviewsAPI/characteristics.csv' DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews from '/Users/edwardpak/Desktop/hackreactor/System-Design-Capstone/ReviewsAPI/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;