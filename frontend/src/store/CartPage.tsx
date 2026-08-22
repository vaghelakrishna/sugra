import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StoreShell from './StoreShell'
import { API, headers, src, money, cartUpdated } from './utils'
import type { CartItem } from './types'
import './StorePages.css'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [message, setMessage] = useState('')

  const load = async () => {
    const r = await fetch(API + '/cart', { headers: headers() })
    if (!r.ok) {
      return setMessage(
        localStorage.getItem('token')
          ? 'Unable to load your bag.'
          : 'Please sign in to view your bag.'
      )
    }
    const b = await r.json()
    setItems(b.data?.items || [])
    setSubtotal(b.data?.summary?.subtotal || 0)
    setMessage('')
  }

  useEffect(() => {
    void load()
  }, [])

  const change = async (item: CartItem, quantity: number) => {
    const r = await fetch(API + `/cart/items/${item.id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ quantity }),
    })
    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      setMessage(err.message || 'Unable to update quantity.')
    } else {
      cartUpdated()
      void load()
    }
  }

  const remove = async (item: CartItem) => {
    const r = await fetch(API + `/cart/items/${item.id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (!r.ok) {
      setMessage('Unable to remove item.')
    } else {
      cartUpdated()
      void load()
    }
  }

  return (
    <StoreShell>
      <main className="shop">
        <p className="eyebrow">YOUR BAG</p>
        <h1>Shopping bag</h1>
        {message && <p className="error">{message}</p>}
        {!items.length ? (
          !message && <p>Your bag is empty.</p>
        ) : (
          <div className="cart">
            <section>
              {items.map((item) => (
                <article key={item.id}>
                  <img src={src(item.product.images?.[0])} alt={item.product.title} />
                  <div>
                    <h2>{item.product.title}</h2>
                    <p>{item.variant?.name}</p>
                    <b>{money(item.unitPrice)}</b>
                    <button className="remove-item" onClick={() => void remove(item)}>
                      Remove
                    </button>
                  </div>
                  <div>
                    <button
                      disabled={item.quantity === 1}
                      onClick={() => void change(item, item.quantity - 1)}
                    >
                      -
                    </button>{' '}
                    {item.quantity}{' '}
                    <button
                      disabled={item.quantity >= item.availableStock}
                      onClick={() => void change(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </section>
            <aside>
              <h2>Order summary</h2>
              <p>
                Subtotal <b>{money(subtotal)}</b>
              </p>
              <Link to="/checkout">Checkout</Link>
            </aside>
          </div>
        )}
      </main>
    </StoreShell>
  )
}

export { CartPage }

