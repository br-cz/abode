import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@abodeorg/common';
import { body } from 'express-validator';

import { Fragrance } from '../models/frag';
import { Order } from '../models/order';

import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [body('fragId').not().isEmpty().withMessage('fragId is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { fragId } = req.body;

    //Find frag user is trying to get and make sure it exists
    const frag = await Fragrance.findById(fragId);
    if (!frag) {
      throw new NotFoundError();
    }

    //Make sure frag is not reserved, concurrency issue because frags are popular
    const isReserved = await frag.isReserved();
    if (isReserved) {
      throw new BadRequestError('Frag is currently reserved');
    }

    //Set expiry date for order, aka the time a user has to buy their frag before it becomes available to the public again
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + EXPIRATION_WINDOW);

    //Build order and save it into our db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiryDate: expiry,
      frag,
    });
    await order.save();

    //Publish event saying an order has been created for the other services
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiryDate: order.expiryDate.toISOString(), //time agnostic data in UTC
      frag: {
        id: frag.id,
        price: frag.price,
      },
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
