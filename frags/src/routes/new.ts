import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@abodeorg/common';
import { Fragrance } from '../models/frag';
import { FragCreatedPublisher } from '../events/publishers/frag-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/frags',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const frag = Fragrance.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await frag.save();

    await new FragCreatedPublisher(natsWrapper.client).publish({
      id: frag.id,
      title: frag.title,
      price: frag.price,
      userId: frag.userId,
    });

    res.status(201).send(frag);
  }
);

export { router as createFragRouter };
