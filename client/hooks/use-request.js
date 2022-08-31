import axios from 'axios';

import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  //assuming method is passed the proper method i.e post get patch

  //null makes it so we don't have to check if errors is defined
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null); //reset alert so an error no longer shows up after valid interaction
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Error!</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
