import express, { Request, Response } from 'express';
import { requireAuth } from '@abodeorg/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('frag'); //where 'frag' is the same as the string in the frag.ts mongoose.model('String', stringSchema);

  res.send(orders);
});

export { router as indexOrderRouter };
