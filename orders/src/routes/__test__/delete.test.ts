import request from 'supertest';
import { app } from '../../app';
import { Fragrance } from '../../models/frag';
import { Order } from '../../models/order';
import { OrderStatus } from '@abodeorg/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  // create a frag with frag Model
  const frag = Fragrance.build({
    title: 'Giorgio Armani',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await frag.save();

  const user = global.getSignInCookie();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ fragId: frag.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  // create a frag with frag Model
  const frag = Fragrance.build({
    title: 'Giorgio Armani',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await frag.save();

  const user = global.getSignInCookie();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ fragId: frag.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
