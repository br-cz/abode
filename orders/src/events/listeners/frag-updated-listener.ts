import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FragUpdatedEvent } from '@abodeorg/common';
import { Fragrance } from '../../models/frag';
import { queueGroupName } from './queue-group-name'; //we hate typos

export class FragUpdatedListener extends Listener<FragUpdatedEvent> {
  subject: Subjects.FragUpdated = Subjects.FragUpdated;
  queueGroupName = queueGroupName;

  //get this interface's data property and set it to data (FragUpdatedEvent['data'])
  async onMessage(data: FragUpdatedEvent['data'], msg: Message) {
    const frag = await Fragrance.findByIdWithVersion(data);

    if (!frag) {
      throw new Error('Frag not found');
    }

    const { title, price } = data;
    frag.set({ title, price });

    await frag.save();

    msg.ack();
  }
}
