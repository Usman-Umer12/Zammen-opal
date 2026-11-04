import { lazy, Suspense, useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'

import Home from './pages/Home'
import Stays from './pages/Stays'
import StayDetail from './pages/StayDetail'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Book from './pages/Book'
import NotFound from './pages/NotFound'

// Admin pages are lazy-loaded to keep the public website lightweight.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ListingsAdmin = lazy(() => import('./pages/admin/ListingsAdmin'))
const ListingForm = lazy(() => import('./pages/admin/ListingForm'))
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  return null
}

function PublicLayout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-black"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Outlet />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />

        <p className="text-sm text-neutral-500">
          Loading admin panel...
        </p>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return <NotFound />
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<AdminLoading />}>
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />

            <Route path="stays" element={<Stays />} />
            <Route path="stays/:slug" element={<StayDetail />} />

            {/* All locations, then one page per city (Lahore, Islamabad, Murree) */}
            <Route path="locations" element={<Locations />} />
            <Route path="locations/:slug" element={<LocationDetail />} />

            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="book" element={<Book />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login */}
          <Route
            path="admin/login"
            element={<Login />}
          />

          {/* Protected Admin Panel */}
          <Route
            path="admin"
            element={<AdminLayout />}
          >
            {/* Default Admin Dashboard */}
            <Route
              index
              element={<Dashboard />}
            />

            {/* Apartments Management */}
            <Route
              path="apartments"
              element={<ListingsAdmin />}
            />

            {/* Add New Apartment */}
            <Route
              path="listings/new"
              element={<ListingForm />}
            />

            {/* Edit Apartment */}
            <Route
              path="listings/:id"
              element={<ListingForm />}
            />

            {/* Locations & Apartment Types */}
            <Route
              path="settings"
              element={<SettingsAdmin />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}