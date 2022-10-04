import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

//same idea from abstract-listener
interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  //void because we're not really doing anything (yet?) with the error
  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject:', this.subject);
        resolve(); //basically means we've handle the error
      });
    });
  }
}
