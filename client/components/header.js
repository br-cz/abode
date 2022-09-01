import Link from 'next/link';

const Header = ({ currentUser }) => {
  //shows the appropriate option depending on valid user or null
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <ul key={href} class="nav-item nav ms-auto my-2 my-lg-0">
          <Link href={href}>
            <a class="nav-link active">{label}</a>
          </Link>
        </ul>
      );
    });

  return (
    <nav class="navbar navbar-light bg-light">
      <Link href="/">
        <a class="navbar-brand px-3">abode</a>
      </Link>

      <div class="d-flex justify-content-end my-2 my-lg-0">
        <ul class="nav ms-auto my-2 my-lg-0"></ul>
        {links}
      </div>
    </nav>
  );
};

export default Header;
