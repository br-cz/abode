import Link from 'next/link';

const Header = ({ currentUser }) => {
  //shows the appropriate option depending on valid user or null
  const links = [
    !currentUser && { label: 'Sign Up/', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <span key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </span>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">abode</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center"></ul>
        {links}
      </div>
    </nav>
  );
};

export default Header;
