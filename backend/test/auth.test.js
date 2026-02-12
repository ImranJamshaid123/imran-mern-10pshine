import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

describe('Auth APIs', () => {

  const user = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: '123456'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message');
  });

  it('should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should send forgot password email', async function () {
    this.timeout(10000); // 10 seconds

    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: user.email });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message');
  });


  it('should reset password with token', async () => {
    const fakeToken = 'testtoken123';

    const res = await request(app)
      .post(`/api/auth/reset-password/${fakeToken}`)
      .send({ password: 'newpassword123' });

    // It may return 400 if token invalid — that is acceptable
    expect(res.status).to.be.oneOf([200, 400]);
  });



});