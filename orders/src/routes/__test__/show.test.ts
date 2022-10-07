import request from 'supertest';
import { app } from '../../app';
import { Fragrance } from '../../models/frag';

it('fetches the order', async () => {
  // Create a Fragrance
  const frag = Fragrance.build({
    title: 'Armani Acqua',
    price: 20,
  });
  await frag.save();

  //make a random user
  const user = global.getSignInCookie();

  // make a request to build an order with this Fragrance
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ fragId: frag.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  //verify the order we got is the same as the order
  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a Fragrance
  const frag = Fragrance.build({
    title: 'Armani Acqua',
    price: 20,
  });
  await frag.save();

  //make a random user
  const user = global.getSignInCookie();

  // make a request to build an order with this Fragrance
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ fragId: frag.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.getSignInCookie()) //make some random user, different from the original user
    .send()
    .expect(401);
});
