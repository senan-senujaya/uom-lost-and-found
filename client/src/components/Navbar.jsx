import { Link } from 'react-router-dom';

function Navbar() {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#002147', // A classic university navy blue
    color: 'white'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '1rem',
    fontWeight: 'bold'
  };

  return (
    <nav style={navStyle}>
      <h2>UoM Lost & Found</h2>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/report" style={linkStyle}>Report Item</Link>
      </div>
    </nav>
  );
}

export default Navbar;