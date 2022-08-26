import express, {Request, response, Response} from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import { validateRequest } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Proper email required'),
    body('password').trim().isLength({min:4,  max:20}).withMessage('Password must be between 4 to 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const user = User.build({email, password});
        await user.save();

        //Generate Jwt
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, 
            //! tells TS we already checked if this env variable is defined, which we did index.ts
            process.env.JWT_KEY! 
        );

        //Store it on req.session created by cookie-session
        //typescript work around for cookie-session not assuming we have ab object on req.session 
        //hence we define the object and assign it
        req.session = {
            jwt: userJwt
        }

        res.status(201).send(user);
});

export { router as signUpRouter };