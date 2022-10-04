import request from 'supertest';
import { app } from '../../app';
import { Fragrance } from '../../models/frag';

import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/frags for post requests', async () => {
  const response = await request(app).post('/api/frags').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/frags').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title: 'asldkjf',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title: 'laskdfj',
    })
    .expect(400);
});

it('returns a created status with valid inputs', async () => {
  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title: 'asldkfj',
      price: 20,
    })
    .expect(201);
});

it('list a frag with valid inputs', async () => {
  let frag = await Fragrance.find({});
  expect(frag.length).toEqual(0);
  const title = 'asldkfj';
  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title,
      price: 20,
    })
    .expect(201);
  frag = await Fragrance.find({});
  expect(frag.length).toEqual(1);
  expect(frag[0].price).toEqual(20);
  expect(frag[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'asldkfj';
  await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
