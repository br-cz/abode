import express from 'express';
import { currentUser } from '@abodeorg/common';

const router = express.Router();

//determines if a signed in in this session and goes through our 2 middleware
//1 to check if they're signed in and 1 checks if they're authenticated
router.get('/api/users/currentuser', currentUser, (req, res) => {
  //if this passes the current user check, we return an object that can be null and should not be undefined
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
