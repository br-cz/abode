import request from 'supertest';
import { app } from '../../app';

const createFrag = () => {
  return request(app)
    .post('/api/frags')
    .set('Cookie', global.getSignInCookie())
    .send({
      title: 'asldkf',
      price: 20,
    });
};

it('can fetch a list of frags', async () => {
  await createFrag();
  await createFrag();
  await createFrag();

  //console.log(await request(app).get('/api/frags'));
  const response = await request(app).get('/api/frags').send().expect(200);

  expect(response.body.length).toEqual(3);
});
