import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

//used for modular sign in for tests
declare global {
  //https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature
  function getSignInCookie(id?: string): string[];
}

//use fake nats wrapper to emulate the functionality of the real one without actually using it
jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51LtgVOCLGMesLm3HHpsm8VUkEBsklONUHVO3HHsV5CLLHojAJnaieRRgTvdQJOvCvLvgVk3ReEuPSYOLugNa7RSb00Drrqxuyi';

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
  jest.clearAllMocks(); //make sure we dont pollute test data
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

//different from the auth signIn because having a dependency on a test is kind of ironic when we've been trying to avoid it this whole time
global.getSignInCookie = (id?: string) => {
  //make a fake JWT payload (id and email)
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(), //some random valid id instead random gibberish like "sdjfsadjsajdksla"
    email: 'fakeqtip@gmail.com',
  };
  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Make a session object {jwt: MY_JWT}
  const session = { jwt: token };
  //turn session into JSON
  const sessionJSON = JSON.stringify(session);
  //Take JSON and encode it as base 64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return a string thats the cookie with data
  return [`session=${base64}`];
};
