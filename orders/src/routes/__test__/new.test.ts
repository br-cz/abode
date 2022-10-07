import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@abodeorg/common';
import { Fragrance } from '../../models/frag';

it('returns an error if the frag does not exist', async () => {
  const fragId = new mongoose.Types.ObjectId();

  //from NotFoundError
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getSignInCookie())
    .send({ fragId })
    .expect(404);
});

it('returns an error if the frag is already reserved', async () => {
  const frag = Fragrance.build({
    title: 'Versace Dylan Blue',
    price: 20,
  });
  await frag.save();

  const order = Order.build({
    frag,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiryDate: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getSignInCookie())
    .send({ fragId: frag.id })
    .expect(400);
});

it('reserves a frag', async () => {
  const frag = Fragrance.build({
    title: 'concert',
    price: 20,
  });
  await frag.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getSignInCookie())
    .send({ fragId: frag.id })
    .expect(201);
});

it.todo('emits an order created event');
