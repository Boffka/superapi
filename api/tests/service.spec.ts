var should    = require('chai').should();
var supertest = require('supertest');
var api       = supertest('http://localhost:3000/api/v1');

describe('service unit tests:', () => {
    it('Should create a service instance', (done: Function) => {
        api.post('/services').send({}).expect(401, done);
    });
});
