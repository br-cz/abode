import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@abodeorg/common';
import { queueGroupName } from './queue-group-name';
import { Fragrance } from '../../models/frag';
import { FragUpdatedPublisher } from '../publishers/frag-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the frag that the order is reserving
    const frag = await Fragrance.findById(data.frag.id);

    // If no frag, throw error
    if (!frag) {
      throw new Error('frag not found');
    }

    // Mark the frag as being reserved by setting its orderId property
    frag.set({ orderId: data.id });

    // Save the frag
    await frag.save();
    await new FragUpdatedPublisher(this.client).publish({
      id: frag.id,
      price: frag.price,
      title: frag.title,
      userId: frag.userId,
      orderId: frag.orderId,
      version: frag.version,
    });

    // ack the message
    msg.ack();
  }
}
