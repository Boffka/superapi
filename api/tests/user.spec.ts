var should    = require('chai').should();
var supertest = require('supertest');
var api       = supertest('http://localhost:3000/api/v1');

describe('profile unit tests:', () => {
    it('Should create a profile instance', (done: Function) => {
        api.get('/profiles').send({}).expect(401, done);
    });
});
