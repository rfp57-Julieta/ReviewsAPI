import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export let options = {
  vus: 100,   // simulate how many virtual users
  duration: '15s', // how long you want it to run
  // duration: '30s',
};

const urlReviews = `http://localhost:3000/reviews?product_id=${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`;

const urlMetadata = `http://localhost:3000/reviews/meta?product_id=${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`;

// Below randomize the endpoints
export default function () {
  // http.get(`http://localhost:3000/reviews?product_id=${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`);

  const res = http.get(urlReviews);
  sleep(1);
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 200 ms': r => r.timings.duration < 200,
    'transaction time < 500 ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
  });
}