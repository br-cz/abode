import express, {Request, Response} from 'express';
import { body } from 'express-validator';

import { Password } from '../services/password';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Missing password')

    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (!existingUser){
            //we want to provide vague auth details in case we have a malicious user
            throw new BadRequestError('Invalid account details');
        }

        const passwordMatches = await Password.compare(existingUser.password, password);
        if(!passwordMatches){
            throw new BadRequestError('Invalid account details')
        }

        //Generate Jwt
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
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

        res.status(200).send(existingUser);
    }
);

export { router as signInRouter };