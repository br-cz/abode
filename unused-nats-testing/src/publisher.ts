import nats from 'node-nats-streaming';
import { FragCreatedPublisher } from './events/frag-created-publisher';

console.clear();

const stan = nats.connect('abode', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new FragCreatedPublisher(stan);
  try {
    publisher.publish({
      id: '69',
      title: 'dylan blue',
      price: 100,
      userId: '01',
    });
  } catch (err) {
    console.log(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'versace eros',
  //   price: 20,
  // });

  // stan.publish('frag:created', data, () => {
  //   console.log('Event published');
  // });
});
