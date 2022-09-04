import axios from 'axios';
import buildClient from '../api/build-client';

const Page = ({ currentUser }) => {
  //if this returns nulls, make sure we are on https://abode.com/auth/signup (https is important as we had that set)
  //   console.log(currentUser);

  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

//getInitProps is called on the initial request to server,
//this is when we can fetch data that we need,
//such as if the user is logged in.
//Furthermore, the first argument to our function is usually referred to as context
Page.getInitialProps = async (context) => {
  // console.log('LANDING PAGE');
  const client = await buildClient(context); //await to build client

  const { data } = await client.get('/api/users/currentuser'); //common await for axios method
  return data;
};

export default Page;
