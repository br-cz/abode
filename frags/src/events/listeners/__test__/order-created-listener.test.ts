import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@abodeorg/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Fragrance } from '../../../models/frag';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a frag
  const frag = Fragrance.build({
    title: 'armani',
    price: 99,
    userId: 'asdf',
  });
  await frag.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiryDate: 'alskdjf',
    frag: {
      id: frag.id,
      price: frag.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, frag, data, msg };
};

it('sets the userId of the frag', async () => {
  const { listener, frag, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedFrag = await Fragrance.findById(frag.id);

  expect(updatedFrag!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, frag, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a frag updated event', async () => {
  const { listener, frag, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  //get a string like this from event:'{"id":"63484f4b5734fd0b44fe904c","price":99,"title":"armani","userId":"asdf","orderId":"63484f4b5734fd0b44fe904e","version":1}',
  const fragUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(fragUpdatedData.orderId);
});
