import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the frag is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); //some random valid id instead random gibberish like "sdjfsadjsajdksla"

  await request(app).get(`/api/frags/${id}`).send().expect(404);
});

it('returns the frag if the frag is found', async () => {
  const title = 'Versace Dylan Blue';
  const price = 20;

  const res = await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  const fragRes = await request(app)
    .get(`/api/frags/${res.body.id}`)
    .send()
    .expect(200);

  expect(fragRes.body.title).toEqual(title);
  expect(fragRes.body.price).toEqual(price);
});
