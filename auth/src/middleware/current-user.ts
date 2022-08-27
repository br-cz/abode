import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

//Help TS assign payload to req.currentUser
interface UserPayLoad{
    id: string;
    email: string;
}

//Reaches into existing type definition and and modifies it,
//in this case, we add a current user object in Request that accepts type UserPayLoad
declare global {
    namespace Express {
        interface Request{
            //might not be defined because the user might be signed in, hence the optional ?
            currentUser?: UserPayLoad;
        }
    }
}

export const currentUser =  (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    //the ? checks the condition of req.session not existing
    if (!req.session?.jwt){
        return next();
    }

    //the try catches an error sent back from verify()
    try{ 
        //tells TS what exactly we're getting from verify
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayLoad;
        req.currentUser = payload;
    } catch(err){}

    //we always want to continue unto the next middleware
    next();
};