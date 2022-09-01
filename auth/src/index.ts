import { app } from './app';
import mongoose from 'mongoose';

//auth-mongo-serv:27107 is the domain mongoose will connect to
//auth is the name of the db mongoose will create for us
const dbUrl = 'mongodb://auth-mongo-srv:27017/auth';
const db = async () => {
  //so TS doesn't throw an error about a possibly undefined env variable
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found');
  }

  try {
    //auth-mongo-serv:27107 is the domain mongoose will connect to
    // /auth is the name of the db mongoose will create for us
    await mongoose.connect(dbUrl, {});
    console.log('Connected to mongo');
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!');
  });
};

db();
