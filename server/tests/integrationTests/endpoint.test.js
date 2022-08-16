const request = require('supertest');
const app = require('../../app');
/**
 * manually run with:
 * $ npx mocha ./endpoint.test.js --exit
 * for debugging specific test:
 * $ npx mocha ./endpoint.test.js --inspect --exit --grep "SEARCH /getEvents"
 *
 */
describe('SEARCH /getEvents', () => {
  it('responds with json and status 200', (done) => {
    request(app)
      .search('/api/getEvents')
      .send({ startRange: new Date(), endRange: new Date() })
      .set('Accept', 'application/json')
      .timeout(2000)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('get events correctly', (done) => {
    request(app)
      .search('/api/getEvents')
      .send({ startRange: new Date(), endRange: new Date() })
      .set('Accept', 'application/json')
      .timeout(2000)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });
});

describe('PUT /updateEvent', () => {
  it('responds with json and status 200', (done) => {
    request(app)
      .put('/api/updateEvent')
      .send({ title: '' })
      .set('Accept', 'application/json')
      .timeout(2000)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('POST /createEvent', () => {
  it('responds with json and status 200', (done) => {
    request(app)
      .post('/api/createEvent')
      .send({ title: 'VV' })
      .set('Accept', 'application/json')
      .timeout(2000)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
