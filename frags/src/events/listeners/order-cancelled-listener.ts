import { Listener, OrderCancelledEvent, Subjects } from '@abodeorg/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Fragrance } from '../../models/frag';
import { FragUpdatedPublisher } from '../publishers/frag-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const frag = await Fragrance.findById(data.frag.id);

    if (!frag) {
      throw new Error('frag not found');
    }

    //undefined means a frag is not reserved
    frag.set({ orderId: undefined });

    await frag.save();
    await new FragUpdatedPublisher(this.client).publish({
      id: frag.id,
      orderId: frag.orderId,
      userId: frag.userId,
      price: frag.price,
      title: frag.title,
      version: frag.version,
    });

    msg.ack();
  }
}
