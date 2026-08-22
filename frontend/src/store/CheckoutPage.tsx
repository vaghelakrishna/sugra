import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreShell from './StoreShell'
import { API, headers, cartUpdated } from './utils'
import './StorePages.css'

const ADDRESS_FIELDS = [
  { name: 'recipientName', placeholder: 'Full name', required: true },
  { name: 'phone', placeholder: 'Phone', required: true },
  { name: 'line1', placeholder: 'Address line 1', required: true },
  { name: 'line2', placeholder: 'Address line 2', required: false },
  { name: 'city', placeholder: 'City', required: true },
  { name: 'state', placeholder: 'State', required: true },
  { name: 'postalCode', placeholder: 'Postal code', required: true },
  { name: 'country', placeholder: 'Country', required: true },
] as const

export default function CheckoutPage() {
  const nav = useNavigate()
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const address = await fetch(API + '/addresses', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    })

    if (!address.ok) {
      return setError('Please sign in and enter valid delivery details.')
    }

    const body = await address.json()
    const order = await fetch(API + '/orders', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ addressId: body.data._id }),
    })

    if (!order.ok) {
      return setError('Your order could not be placed.')
    }

    cartUpdated()
    nav('/order-success')
  }

  return (
    <StoreShell>
      <main className="shop checkout">
        <p className="eyebrow">SECURE CHECKOUT</p>
        <h1>Delivery details</h1>
        <form onSubmit={submit}>
          {ADDRESS_FIELDS.map(({ name, placeholder, required }) => (
            <input
              name={name}
              placeholder={placeholder}
              required={required}
              key={name}
            />
          ))}
          <input name="label" value="Home" readOnly />
          <button type="submit">Place order</button>
          {error && <p className="error">{error}</p>}
        </form>
      </main>
    </StoreShell>
  )
}

export { CheckoutPage }

