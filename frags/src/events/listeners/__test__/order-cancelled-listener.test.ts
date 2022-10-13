import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@abodeorg/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Fragrance } from '../../../models/frag';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const frag = Fragrance.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });
  frag.set({ orderId });
  await frag.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    frag: {
      id: frag.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, frag, orderId, listener };
};

it('updates the frag, publishes an event, and acks the message', async () => {
  const { msg, data, frag, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedfrag = await Fragrance.findById(frag.id);
  expect(updatedfrag!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
