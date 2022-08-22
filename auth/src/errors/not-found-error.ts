import { CustomError } from './custom-error';

export class NotFoundError extends CustomError{
    statusCode = 404;

    constructor(){
        super('Route not found');

        //for extending built in class Error
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [
            {message: 'Route not found'}
        ]
    }
}