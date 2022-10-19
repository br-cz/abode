import axios from 'axios'; //need this here instead useRequest hook because get-init-props is a next js function
// import https from 'https';

const buildClient = async ({ req }) => {
  //to ignore ssl warning
  //   const agent = new https.Agent({
  //     rejectUnauthorized: false,
  //   });

  //window only exists inside the browser, not in a node js environment
  if (typeof window === 'undefined') {
    //let ingress connect us to to the proper route
    //ingress-nginx is the namespace in k8s, and the controller is the service name and everything else is the domain template
    return axios.create({
      baseURL:
        // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        'abode.lol',
      //   httpsAgent: agent,
      headers: req.headers,
    });
  } else {
    //we are on the browser and can let the browser do its thing according to our diagram
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
