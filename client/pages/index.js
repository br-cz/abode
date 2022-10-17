import Link from 'next/link';

const Page = ({ currentUser, frags }) => {
  //if we get that we are not signed in / returns nulls, make sure we are on https://abode.com/auth/signup (https is important as we had that set)

  const fragList = frags.map((frag) => {
    return (
      <tr key={frag.id}>
        <td>{frag.title}</td>
        <td>{frag.price}</td>
        <td>
          <Link href="/frags/[fragId]" as={`/frags/${frag.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>frags</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{fragList}</tbody>
      </table>
    </div>
  );
};

//getInitProps is called on the initial request to server,
//this is when we can fetch data that we need,
//such as if the user is logged in.
//Furthermore, the first argument to our function is usually referred to as context
Page.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/frags');

  console.log(data);
  return { frags: data };
};

export default Page;
