import { NavLink, Link } from 'react-router'

const APP_NAME = 'Sanad Player'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link className="brand-link" to="/">
          {APP_NAME}
        </Link>
      </div>
      <div className="navbar-links">
        <NavLink className="nav-link" to="/">
          All songs
        </NavLink>
        <NavLink className="nav-link" to="/playlists">
          Playlists
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
