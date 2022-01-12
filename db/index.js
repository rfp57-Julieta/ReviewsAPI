const { Client } = require('pg');


const client = new Client({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'reviews'
});

client.connect()
.then((res) => {
  console.log('Connected to Postgres successfully!');
})
.catch((err) => {
  console.log(err);
})

module.exports = {
  client
}