import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

describe('Notes APIs', () => {

  let token;
  let noteId;
  const user = {
    name: 'Note User',
    email: `note${Date.now()}@example.com`,
    password: '123456'
  };

  before(async () => {
    // Register
    await request(app)
      .post('/api/auth/register')
      .send(user);

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password
      });

    token = loginRes.body.token;
  });

  it('should create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Note',
        content: 'This is a test note'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('success');
    noteId = res.body.noteId;
  });

  it('should get all notes', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

 it('should update note', async () => {
    // Make sure we have a noteId
    expect(noteId).to.exist;
    
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Note',
        content: 'Updated content'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'Note updated successfully');
  });

  it('should delete note', async () => {
    // Make sure we have a noteId
    expect(noteId).to.exist;
    
    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'Note deleted successfully');
  });


});