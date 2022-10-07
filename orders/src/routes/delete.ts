import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from '@abodeorg/common';
import { requireAuth } from '@abodeorg/common';

const router = express.Router();

//not really deleting, more like cancelling the order
//possible to do refactor for clearer objective?
router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
