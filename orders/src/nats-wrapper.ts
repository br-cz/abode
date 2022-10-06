import nats, { Stan } from 'node-nats-streaming';

//acts a singleton, similar to how Mongo works wherein a single instance is shared amongst classes
class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot use an unconnected NATS client');
    }

    return this._client;
  }

  //when we call this.client as opposed to this._client, we are referring to the get client()
  //we can do so because we connect our client before the code including it is executed
  //we do this because it looks better than having the !
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    this._client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    //close our service gracefully
    process.on('SIGINT', () => this.client.close());
    process.on('SIGTERM', () => this.client.close());

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
