import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewFrag = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/frags',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price); //get user input

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2)); //transform into valid price $x.xx
  };

  return (
    <div>
      <h1>List a Fragrance!</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Fragrance Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewFrag;
