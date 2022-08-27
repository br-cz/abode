import {Request, Response, NextFunction} from 'express';
import { UnauthorizedError } from '../errors/unauthorized-error';

//we assume current-user is ran before this, as it should
export const requireAuth =  (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (!req.currentUser){
        throw new UnauthorizedError();
    }

    next();
}