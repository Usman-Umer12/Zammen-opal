import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from '../../hooks/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Seo from '../../components/Seo'

function Form() {
  const { session, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 px-5">
      <Seo title="Admin login" noindex path="/admin/login" />
      <div className="w-full max-w-md rounded-2xl border border-pine-100 bg-white p-8 shadow-card">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold">Admin sign in</h1>
        {!isSupabaseConfigured && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Supabase is not configured yet. Add your keys to <code>.env</code> to enable sign in.
          </p>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input id="email" type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input id="password" type="password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy || !isSupabaseConfigured} className="btn-primary w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <Link to="/" className="mt-6 block text-center text-sm text-pine-600 hover:text-pine-900">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <AuthProvider>
      <Form />
    </AuthProvider>
  )
}
