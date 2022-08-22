import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError{
    statusCode = 500
    reason = "Error connecting to database";

    constructor(){
        super('Error connecting to database');

        //for extending built in class Error
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [
            {message: this.reason}
        ]
    }
}