import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); //some random valid id instead random gibberish like "sdjfsadjsajdksla"
  await request(app)
    .put(`/api/frags/${id}`)
    .set('Cookie', global.getSignInCookie())
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/frags/${id}`)
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the frags', async () => {
  const res = await request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/frags/${res.body.id}`)
    .set('Cookie', global.getSignInCookie()) //regenerate a new random id to mismatch
    .send({
      title: 'alskdjflskjdf',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getSignInCookie();

  const res = await request(app).post('/api/frags').set('Cookie', cookie).send({
    title: 'asldkfj',
    price: 20,
  });

  await request(app)
    .put(`/api/frags/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/frags/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
    })
    .expect(400);
});

it('updates the frags provided valid inputs', async () => {
  const cookie = global.getSignInCookie();

  const res = await request(app).post('/api/frags').set('Cookie', cookie).send({
    title: 'asldkfj',
    price: 20,
  });

  await request(app)
    .put(`/api/frags/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  const fragRes = await request(app).get(`/api/frags/${res.body.id}`).send();

  expect(fragRes.body.title).toEqual('new title');
  expect(fragRes.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.getSignInCookie();

  const res = await request(app).post('/api/frags').set('Cookie', cookie).send({
    title: 'asldkfj',
    price: 20,
  });

  await request(app)
    .put(`/api/frags/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
