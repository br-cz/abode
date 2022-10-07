import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Fragrance } from '../../models/frag';

const buildFrag = async () => {
  const frag = Fragrance.build({
    title: 'concert',
    price: 20,
  });
  await frag.save();

  return frag;
};

it('fetches orders for an particular user', async () => {
  // Create three frags
  const fragOne = await buildFrag();
  const fragTwo = await buildFrag();
  const fragThree = await buildFrag();

  //Make some fake users
  const userOne = global.getSignInCookie();
  const userTwo = global.getSignInCookie();

  // Create one order using User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ fragId: fragOne.id })
    .expect(201);

  // Create two orders using User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ fragId: fragTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ fragId: fragThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].frag.id).toEqual(fragTwo.id);
  expect(response.body[1].frag.id).toEqual(fragThree.id);
});
