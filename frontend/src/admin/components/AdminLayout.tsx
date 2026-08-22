import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { User } from '../types'
import { Icons } from './ui'
import '../Admin.css'

const navItems = [
  { to: '', label: 'Overview', icon: Icons.Overview },
  { to: 'products', label: 'Products', icon: Icons.Products },
  { to: 'categories', label: 'Categories', icon: Icons.Categories },
  { to: 'inventory', label: 'Inventory', icon: Icons.Inventory },
  { to: 'orders', label: 'Orders', icon: Icons.Orders },
  { to: 'reviews', label: 'Reviews', icon: Icons.Reviews },
]

export default function AdminLayout({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const section = location.pathname.split('/')[2] || ''
  const currentNav = navItems.find((x) => x.to === section) || navItems[0]

  return (
    <div className="admin-shell">
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            SUGRA
            <small>ADMIN PORTAL</small>
          </div>
          <button
            type="button"
            className="admin-mobile-toggle"
            style={{ color: '#fff', borderColor: '#3a2f28' }}
            onClick={() => setMobileOpen(false)}
          >
            <Icons.Close />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: IconComponent }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ''}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <IconComponent />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-user-box">
          <div className="admin-avatar">{user.name?.[0]?.toUpperCase() || 'A'}</div>
          <div className="admin-user-info">
            <div className="admin-user-name">{user.name}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
          >
            <Icons.Logout />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Icons.Menu />
            </button>
            <div className="admin-header-title">
              <small>Store Management</small>
              <h1>{currentNav.label}</h1>
            </div>
          </div>
          <div className="admin-avatar" title={user.name}>
            {user.name?.[0]?.toUpperCase() || 'A'}
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
