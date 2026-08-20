import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Product = { _id: string; slug: string; title: string; price: number; images?: string[]; category?: { name: string } }
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const imageSrc = (path?: string) => path?.startsWith('/') ? `${API.replace('/api', '')}${path}` : path
const price = (value: number) => `$${value.toFixed(2)}`

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API}/products?limit=4&sort=-createdAt`)
      const body = await response.json()
      if (!response.ok) throw new Error(body.message || 'Unable to load products')
      setProducts(Array.isArray(body.data) ? body.data.slice(0, 4) : [])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadProducts() }, [])

  return <section className="arrivals-section"><div className="section-heading"><div><p className="eyebrow">JUST IN</p><h2>New arrivals.</h2></div><Link className="text-link" to="/collections">Shop all pieces <span>↗</span></Link></div>{loading ? <div className="product-state" aria-live="polite">Discovering the latest pieces<span className="loading-dots">...</span></div> : error ? <div className="product-state product-error" role="alert"><p>{error}</p><button onClick={() => void loadProducts()}>Try again</button></div> : products.length === 0 ? <div className="product-state">New pieces are arriving soon.</div> : <div className="product-grid">{products.map(product => <Link className="product-card" to={`/products/${product.slug}`} key={product._id}><div className="product-image"><img src={imageSrc(product.images?.[0])} alt={product.title} /><span>New</span></div><small>{product.category?.name || 'SUGRA'}</small><h3>{product.title}</h3><b>{price(product.price)}</b></Link>)}</div>}</section>
}
