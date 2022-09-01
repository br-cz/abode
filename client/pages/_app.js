import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = await buildClient(appContext.ctx); //await to build client
  const { data } = await client.get('/api/users/currentuser'); //get info needed for every page

  //gets custom info for other pages as needed
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx); //executes index.js's getinitprops
  }
  console.log(pageProps);

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
