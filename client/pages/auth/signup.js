import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'), //redirect successful signup to landing page
  });

  const onSubmit = async (event) => {
    event.preventDefault(); //stop form from submitting itself through browser

    doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Signup</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          type="password"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};

export default Page;
