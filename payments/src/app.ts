import express from 'express';
import { json } from 'body-parser';

//import before routes
import 'express-async-errors';

import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@abodeorg/common';

const app = express();
//traffic to our app is being proxy'd through ingress and
//since we're only sending cookies when users are connected through https
//we let express know it can trust that proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    //don't need to encrypt cookies because JWTs are tamper resistant
    //and this allows cookies to be easily read across multiple langs
    signed: false,
    secure: process.env.NODE_ENV !== 'test', //allows unsecure requests during testing
  })
);

//should be ran after cookieSession so it can set the req.session property properly
app.use(currentUser);

//send not found error for all undefined routes
app.all('*', async (req, res) => {
  // console.log('added express async errors');
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
