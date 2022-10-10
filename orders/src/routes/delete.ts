import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from '@abodeorg/common';
import { requireAuth } from '@abodeorg/common';

import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

//not really deleting, more like cancelling the order
//possible to do refactor for clearer objective?
router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('frag'); //populate frag to get frag id

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      frag: {
        id: order.frag.id,
      },
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
