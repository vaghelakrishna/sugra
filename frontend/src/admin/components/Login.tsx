import { useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from '../types'
import '../Admin.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Login({ onSuccess }: { onSuccess: (user: User, token: string) => void }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const f = new FormData(e.currentTarget)
    try {
      const r = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: f.get('email'), password: f.get('password') }),
      })
      const b = await r.json()
      if (!r.ok || b.user?.role !== 'admin') {
        setError(b.message || 'Access restricted to administrators only.')
        return
      }
      onSuccess(b.user, b.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login connection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#1a1512',
        padding: '24px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: 'min(420px, 100%)',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '44px 36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          border: '1px solid #332720',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '3px',
              color: 'var(--admin-gold)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            SUGRA PORTAL
          </span>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              margin: '0 0 6px',
              color: '#231c18',
            }}
          >
            Admin Sign In
          </h1>
          <p style={{ fontSize: '13px', color: '#796e65', margin: 0 }}>
            Sign in with authorized administrator credentials.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              background: '#fdf2f0',
              border: '1px solid #f0d0cb',
              borderRadius: '8px',
              color: '#b83a30',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={login} style={{ display: 'grid', gap: '16px' }}>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#332b25' }}>
              Administrator Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="shopsugrajewels@gmail.com"
              required
              autoFocus
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #ded5cc',
                fontSize: '14px',
              }}
            />
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#332b25' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••••••"
              required
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #ded5cc',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{
              marginTop: '8px',
              padding: '13px',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href="/"
            style={{
              fontSize: '12px',
              color: 'var(--admin-gold)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Back to Storefront
          </a>
        </div>
      </div>
    </main>
  )
}
