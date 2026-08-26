import { createContext, useContext, useState } from 'react'

type User = { name: string; email: string; role: 'customer' | 'admin' }
type Auth = {
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

const Context = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  const login = (token: string, next: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(next))
    setUser(next)
    window.dispatchEvent(new Event('auth:updated'))
    window.dispatchEvent(new Event('cart:updated'))
    window.dispatchEvent(new Event('wishlist:updated'))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.dispatchEvent(new Event('auth:updated'))
    window.dispatchEvent(new Event('cart:updated'))
    window.dispatchEvent(new Event('wishlist:updated'))
  }

  return (
    <Context.Provider value={{ user, login, logout }}>
      {children}
    </Context.Provider>
  )
}

export const useAuth = () => {
  const value = useContext(Context)
  if (!value) throw Error('useAuth must be inside AuthProvider')
  return value
}
