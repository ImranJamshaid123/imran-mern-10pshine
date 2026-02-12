import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

describe('User APIs', () => {

  let token;
  const user = {
    name: 'Profile User',
    email: `profile${Date.now()}@example.com`,
    password: '123456'
  };

  before(async () => {
    await request(app)
      .post('/api/auth/register')
      .send(user);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password
      });

    token = loginRes.body.token;
  });

  it('should get profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it('should update profile', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name'
      });

    expect(res.status).to.equal(200);
  });

  it('should change password', async () => {
    const res = await request(app)
      .put('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: user.password,
        newPassword: 'newpassword123'
      });

    expect(res.status).to.equal(200);
  });

});
