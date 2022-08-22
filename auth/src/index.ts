import express from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

import 'express-async-errors';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter); 
app.use(signInRouter); 
app.use(signOutRouter); 
app.use(signUpRouter); 

//send not found error for all undefined routes
app.all('*', async (req, res) => {
    console.log("added express async errors");
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!");
});