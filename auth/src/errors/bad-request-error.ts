import { CustomError } from './custom-error';

export class BadRequestError extends CustomError{
    statusCode = 400;

    constructor(public message: string){
        super(message); //only for logging purposes

        //for extending built in class Error
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{message: this.message}];
    }
}