import { Listener, OrderCreatedEvent, Subjects } from '@abodeorg/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //we set expiryDate in routes/new in orders
    const delay = new Date(data.expiryDate).getTime() - new Date().getTime();
    console.log('waiting this many seconds to process job:', delay / 1000);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay, //10 second delay
      }
    );

    msg.ack();
  }
}
