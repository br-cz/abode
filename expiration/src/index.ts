import { natsWrapper } from './nats-wrapper';

const db = async () => {
  //so TS doesn't throw an error about a possibly undefined env variable
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

    //auth-mongo-serv:27107 is the domain mongoose will connect to
    // /auth is the name of the db mongoose will create for us
  } catch (e) {
    console.log(e);
  }
};

db();
