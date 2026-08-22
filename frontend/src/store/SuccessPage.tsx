import { Link } from 'react-router-dom'
import StoreShell from './StoreShell'
import './StorePages.css'

export default function SuccessPage() {
  return (
    <StoreShell>
      <main className="shop">
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h1>Thank you for your order.</h1>
        <Link to="/collections">Continue shopping</Link>
      </main>
    </StoreShell>
  )
}

export { SuccessPage }

