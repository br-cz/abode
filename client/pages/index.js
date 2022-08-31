import axios from 'axios'; //need this here instead useRequest hook because get-init-props is a next js function
import https from 'https';

const Page = ({ currentUser }) => {
  //if this returns nulls, make sure we are on https://abode.com/auth/signup (https is important as we had that set)
  console.log(currentUser);
  //   axios.get('/api/users/currentuser').catch((err) => {
  //     console.log(err.message);
  //   });

  return <h1>Landing Page</h1>;
};

//getInitProps is called on the initial request to server
//this is when we can fetch data that we need
//such as if the user is logged in
Page.getInitialProps = async ({ req }) => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  //   console.log('req', req.headers);

  //window only exists inside the browser, not in a node js environment
  if (typeof window === 'undefined') {
    //let ingress connect us to to the proper route
    //ingress-nginx is the namespace in k8s, and the controller is the service name and everything else is the domain template
    const { data } = await axios.get(
      // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      'https://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        httpsAgent: agent,
        headers: req.headers, //let all the attributes from the request be passed along unto ingress
      }
    );
    return data;
  } else {
    //we are on the browser and can let the browser do its thing according to our diagram
    const { data } = await axios.get('/api/users/currentuser');
    console.log(data);
    return data;
  }
};

export default Page;
