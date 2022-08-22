import express from 'express';

const router = express.Router();

router.get('/api/users/curentuser', (req, res) => {
    res.send('Its working!!!!!!!!!!!!');
});

export { router as currentUserRouter };