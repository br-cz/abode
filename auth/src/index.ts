import express from 'express';
import { json } from 'body-parser';

import mongoose from 'mongoose';
//import before routes
import 'express-async-errors';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

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
        secure: true
    })
)

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

//auth-mongo-serv:27107 is the domain mongoose will connect to
// /auth is the name of the db mongoose will create for us
// const dbUrl = 'mongodb://auth-mongo-serv:27017/auth';
// mongoose.connect( dbUrl );

// //helps verify everything is running smoothly
// const db = mongoose.connection;
// db.on( "error", console.error.bind( console, "Auth Database Connection error!" ) );
// db.once( "open", () => {
//     console.log( "Auth Database Connected!" );
// } )


const db = async() => {
    //so TS doesn't throw an error about a possibly undefined env variable
    if (!process.env.JWT_KEY){
        throw new Error('JWT_KEY not found');
    }

    try {
    //auth-mongo-serv:27107 is the domain mongoose will connect to
    // /auth is the name of the db mongoose will create for us
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {});
        console.log('Connected to mongo');
    } catch (e){
        console.log(e);
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000!!!!!!!");
    });
};

db();
  