import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { FragCreatedListener } from './events/frag-created-listener';

//remove the clutter from the previous connection
console.clear();

//By default the NATS server exposes multiple ports, where 4222 is for clients
//stan is the default name for the nats streaming client variable
//and abode is our db
const stan = nats.connect('abode', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

//detects when nats emits a connect event
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  //THIS CODE CREATES A RUNNING INSTANCE OF OUR FRAG CREATED LISTENER
  new FragCreatedListener(stan).listen();
});

//close our service gracefully
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
