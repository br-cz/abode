import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { FragUpdatedEvent } from '@abodeorg/common';
import { FragUpdatedListener } from '../frag-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Fragrance } from '../../../models/frag'; 

const setup = async () => {
  // Create a listener
  const listener = new FragUpdatedListener(natsWrapper.client);

  // Create and save a frag
  const frag = Fragrance.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await frag.save();

  // Create a fake data object
  const data: FragUpdatedEvent['data'] = {
    id: frag.id,
    version: frag.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'ablskdjf',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, frag, listener };
};

it('finds, updates, and saves a frag', async () => {
  const { msg, data, frag, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedFrag = await Fragrance.findById(frag.id);

  expect(updatedFrag!.title).toEqual(data.title);
  expect(updatedFrag!.price).toEqual(data.price);
  expect(updatedFrag!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, frag } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
