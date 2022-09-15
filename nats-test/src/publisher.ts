import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('fragz', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'versace eros',
    price: 20,
  });

  stan.publish('frag:created', data, () => {
    console.log('Event published');
  });
});
