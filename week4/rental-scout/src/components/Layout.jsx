import { Link, NavLink, Outlet } from 'react-router-dom'

function Layout({ savedCount }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Rental Scout</Link>
        <nav>
          <NavLink to="/">Browse</NavLink>
          <NavLink to="/saved">Saved ({savedCount})</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
