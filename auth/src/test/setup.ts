import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

//used for modular sign in for tests
declare global {
  //https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature
  function getSignInCookie(): Promise<string[]>;
}

let mongo: any; //for using this in beforeAll and afterAll

//before we starts all of our tests, create the in memory mongodb
//to run multiples tests across our project without reaching for the same
//copy of mongo (i.e when two services try to use port 3000)
//this is our hook function for it
beforeAll(async () => {
  process.env.JWT_KEY = 'monkeypox'; //need to be refactored in a more secure way
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

//before each test starts, we need to reach into our in memory mongodb and "reset"
//all data inside there by deleting all collections within
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//after all tests are finished, stop the in memory mongo as there is no need for it anymore
afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

global.getSignInCookie = async () => {
  const email = 'qtip@gmail.com';
  const password = 'qtip';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
