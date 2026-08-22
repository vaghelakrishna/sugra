import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StoreShell from './StoreShell'
import { API } from './utils'
import './StorePages.css'

export default function CustomerLoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [register, setRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const values = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch(API + `/auth/${register ? 'register' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const body = await response.json().catch(() => ({}))
    setLoading(false)

    if (!response.ok) {
      return setError(body.message || 'Unable to sign in.')
    }

    login(body.token, body.user)
    nav('/')
  }

  return (
    <StoreShell>
      <main className="shop checkout">
        <p className="eyebrow">SUGRA ACCOUNT</p>
        <h1>{register ? 'Create account' : 'Welcome back'}</h1>
        <form onSubmit={submit}>
          {register && <input name="name" placeholder="Full name" required />}
          <input name="email" type="email" placeholder="Email address" required />
          <input
            name="password"
            type="password"
            minLength={8}
            placeholder="Password"
            required
          />
          <button disabled={loading}>
            {loading ? 'Please wait...' : register ? 'Create account' : 'Sign in'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <button
          className="auth-switch"
          onClick={() => {
            setRegister((value) => !value)
            setError('')
          }}
        >
          {register ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
        <p>
          <Link to="/">Continue shopping</Link>
        </p>
      </main>
    </StoreShell>
  )
}
