import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FragCreatedEvent } from '@abodeorg/common';
import { Fragrance } from '../../models/frag';
import { queueGroupName } from './queue-group-name'; //we hate typos

export class FragCreatedListener extends Listener<FragCreatedEvent> {
  subject: Subjects.FragCreated = Subjects.FragCreated;
  queueGroupName = queueGroupName;

  //get this interface's data property and set it to data (FragUpdatedEvent['data'])
  async onMessage(data: FragCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const frag = Fragrance.build({
      id,
      title,
      price,
    });
    await frag.save();

    msg.ack();
  }
}
