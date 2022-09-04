import express, { Request, Response } from 'express';
import { Fragrance } from '../models/frag';

const router = express.Router();

router.get('/api/frags', async (req: Request, res: Response) => {
  const frags = await Fragrance.find({});

  res.send(frags);
});

export { router as retrieveFragsRouter };
