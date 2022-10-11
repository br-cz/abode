import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError,
} from '@abodeorg/common';
import { Fragrance } from '../models/frag';
import { FragUpdatedPublisher } from '../events/publishers/frag-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
natsWrapper;

const router = express.Router();

router.put(
  '/api/frags/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const frag = await Fragrance.findById(req.params.id);

    if (!frag) {
      throw new NotFoundError();
    }

    // console.log(frag.userId);
    // console.log(req.currentUser!.id);

    if (frag.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    frag.set({
      title: req.body.title,
      price: req.body.price,
    });
    await frag.save();

    new FragUpdatedPublisher(natsWrapper.client).publish({
      id: frag.id,
      title: frag.title,
      price: frag.price,
      userId: frag.userId,
      version: frag.version,
    });

    res.send(frag);
  }
);

export { router as updateFragRouter };
