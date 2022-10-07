import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@abodeorg/common';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [body('fragId').not().isEmpty().withMessage('fragId is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
