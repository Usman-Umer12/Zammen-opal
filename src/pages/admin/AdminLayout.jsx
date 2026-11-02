
import { NavLink, Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import {
  Building2,
  ExternalLink,
  LogOut,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react'
import { useState } from 'react'

import { AuthProvider, useAuth } from '../../hooks/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'
import Seo from '../../components/Seo'

const links = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/apartments',
    label: 'Apartments',
    icon: Building2,
  },
  {
    to: '/admin/settings',
    label: 'Locations & Types',
    icon: Settings,
  },
]

function Shell() {
  const { session, isAdmin, loading, signOut } = useAuth()
  const [mobileMenu, setMobileMenu] = useState(false)
  const location = useLocation()

  const currentPage =
    links.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to)
    )?.label || 'Dashboard'

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
        <div className="w-full max-w-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-black">Connect Supabase</h1>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            Add your Supabase credentials to the .env file and configure your database.
          </p>
          <Link to="/" className="mt-7 inline-flex bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
            Back to website
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
          <p className="mt-4 text-sm text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
        <div className="w-full max-w-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-black">No admin access</h1>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            You are signed in as <strong className="text-black">{session.user.email}</strong>,
            but this account has not been added to the admins table.
          </p>
          <button onClick={signOut} className="mt-7 inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-black">
      {mobileMenu && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#111111] text-white transition-transform duration-300 lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
          <Link to="/admin" onClick={() => setMobileMenu(false)} className="flex flex-col">
            <span className="font-serif text-[22px] font-semibold tracking-wide">ZAMEEN OPAL</span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[3px] text-gray-400">
              Management Portal
            </span>
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-gray-500">
            Management
          </p>

          <nav className="space-y-1.5" aria-label="Admin navigation">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3.5 py-3 text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="my-8 border-t border-white/10" />

          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-gray-500">
            Website
          </p>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={18} strokeWidth={1.8} />
            <span>Visit Website</span>
            <ArrowUpRight size={14} className="ml-auto" />
          </Link>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              {session.user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white">Administrator</p>
              <p className="mt-1 truncate text-[10px] text-gray-400">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
              className="rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Admin</span><span>/</span>
                <span className="text-gray-700">{currentPage}</span>
              </div>
              <h1 className="mt-1 text-base font-semibold tracking-tight text-black sm:text-lg">
                {currentPage}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-400 sm:block">Management Portal</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-black">
              {session.user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-150px)] w-full max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <Outlet />
        </main>

        <footer className="border-t border-gray-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-2 text-[11px] text-gray-400 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Zameen Opal. All rights reserved.</p>
            <p>Admin Management Portal</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AuthProvider>
      <Seo title="Admin" noindex path="/admin" />
      <Shell />
    </AuthProvider>
  )
}

export { AuthProvider }
