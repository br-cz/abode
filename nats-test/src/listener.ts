import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

//remove the clutter from the previous connection
console.clear();

//By default the NATS server exposes multiple ports, where 4222 is for clients
//stan is the default name for the nats streaming variable
const stan = nats.connect('fragz', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions() //for customizing our nats listener
    .setManualAckMode(true) //allows us to manually acknowledge the message to make sure we've handled it the way we want
    .setDeliverAllAvailable() //allows us to deliver and ack all missed or previous messages/events to our services one time
    .setDurableName('frag-service'); //allows to set names for our missed deliveries

  const subscription = stan.subscribe(
    'frag:created',
    'queue-group-name', //even if we disconnect once, nats is not going to dump all our events within the subscriptions
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

//close our service gracefully
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
