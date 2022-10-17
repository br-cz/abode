import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const FragShow = ({ frag }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      fragId: frag.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{frag.title}</h1>
      <h4>Price: {frag.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

FragShow.getInitialProps = async (context, client) => {
  const { fragId } = context.query;
  const { data } = await client.get(`/api/frags/${fragId}`);

  return { frag: data };
};

export default FragShow;
