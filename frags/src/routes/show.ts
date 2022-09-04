import { NotFoundError } from '@abodeorg/common';
import express, { Request, Response } from 'express';
import { Fragrance } from '../models/frag';

const router = express.Router();

router.get('/api/frags/:id', async (req: Request, res: Response) => {
  const frag = await Fragrance.findById(req.params.id);

  if (!frag) {
    throw new NotFoundError();
  }

  res.send(frag);
});

export { router as showFragRouter };
