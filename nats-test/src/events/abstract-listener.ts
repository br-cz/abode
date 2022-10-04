import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

//T with type of 'Event', allowing us to specify what type our variables will be
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;

  private client: Stan;
  protected ackWait = 5 * 1000; //5*1000 stands for 5 milliseconds, our arbitrary acknowledgement time limit

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions() //for customizing our nats listener
      .setManualAckMode(true) //allows us to manually acknowledge the message to make sure we've handled it the way we want
      .setDeliverAllAvailable() //allows us to deliver and ack all missed or previous messages/events to our services one time
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); //allows to set names for our missed deliveries;
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
