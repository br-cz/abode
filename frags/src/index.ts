import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const db = async () => {
  console.log('Deployed on Digital Ocean!!!');

  //so TS doesn't throw an error about a possibly undefined env variable
  console.log('okay try again');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not found');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not found');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID not found');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL not found');
  }

  try {
    //where 'abode' is the id of the cluster we're connecting to via -cid in nats-depl.yaml
    //
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    //gracefully close client
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    //close our service gracefully
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    //auth-mongo-serv:27107 is the domain mongoose will connect to
    // /auth is the name of the db mongoose will create for us
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('Connected to mongo');
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!');
  });
};

db();
