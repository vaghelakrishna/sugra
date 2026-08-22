import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Heart, ShoppingBag } from 'lucide-react'
import { FaFacebookF, FaLink, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'
import StoreShell from './StoreShell'
import { API, headers, src, money, cartUpdated, wishlistUpdated } from './utils'
import type { Product, WishlistItem } from './types'
import './StorePages.css'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Please sign in to view your wishlist.')
      setItems([])
      setLoading(false)
      return
    }

    try {
      const r = await fetch(API + '/wishlist', { headers: headers() })
      if (!r.ok) {
        setMessage('Unable to load your wishlist.')
        return setLoading(false)
      }
      const b = await r.json()
      const validItems = (b.data?.items || []).filter((x: WishlistItem) => x && x.product)
      setItems(validItems)
      setSelected([])
      setMessage('')
      wishlistUpdated()
    } catch {
      setMessage('Unable to load your wishlist.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    fetch(API + '/products?limit=8')
      .then((r) => r.json())
      .then((b) => setRecommendations(b.data || []))
      .catch(() => setRecommendations([]))
  }, [])

  const visible = items.filter(
    (x) =>
      x.product &&
      x.product.title &&
      x.product.title.toLowerCase().includes(query.toLowerCase())
  )
  const ids = new Set(items.filter((x) => x.product).map((x) => x.product._id))
  const recommended = recommendations.filter((x) => !ids.has(x._id)).slice(0, 4)

  const remove = async (id: string) => {
    try {
      const r = await fetch(API + `/wishlist/items/${id}`, {
        method: 'DELETE',
        headers: headers(),
      })
      if (r.ok) {
        wishlistUpdated()
        void load()
      } else {
        setMessage('Unable to remove wishlist item.')
      }
    } catch {
      setMessage('Unable to remove wishlist item.')
    }
  }

  const quantity = async (item: WishlistItem, value: number) => {
    if (value < 1) return
    try {
      const r = await fetch(API + `/wishlist/items/${item._id}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ quantity: value }),
      })
      if (r.ok) {
        void load()
      } else {
        setMessage('Unable to update quantity.')
      }
    } catch {
      setMessage('Unable to update quantity.')
    }
  }

  const move = async (item: WishlistItem) => {
    if (!item.product) return
    try {
      const r = await fetch(API + '/cart/items', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          productId: item.product._id,
          variantId: item.variantId,
          quantity: item.quantity || 1,
        }),
      })
      if (r.ok) {
        cartUpdated()
        wishlistUpdated()
        void remove(item._id)
      } else {
        const err = await r.json().catch(() => ({}))
        setMessage(err.message || 'Unable to move this item to your bag.')
      }
    } catch {
      setMessage('Unable to move this item to your bag.')
    }
  }

  const share = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

  return (
    <StoreShell>
      <main className="wishlist-page">
        <div className="wishlist-heading">
          <div>
            <p className="eyebrow">SAVED PIECES</p>
            <h1>My Wishlist</h1>
          </div>
          <div className="wishlist-share">
            <button
              onClick={() =>
                share(
                  'https://www.facebook.com/sharer/sharer.php?u=' +
                    encodeURIComponent(window.location.href)
                )
              }
              title="Share on Facebook"
            >
              <FaFacebookF />
            </button>
            <button
              onClick={() =>
                share(
                  'https://twitter.com/intent/tweet?url=' +
                    encodeURIComponent(window.location.href)
                )
              }
              title="Share on X"
            >
              <FaXTwitter />
            </button>
            <button
              onClick={() =>
                share(
                  'https://wa.me/?text=' + encodeURIComponent(window.location.href)
                )
              }
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </button>
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href)
                setMessage('Wishlist link copied to clipboard!')
                setTimeout(() => setMessage(''), 2500)
              }}
              title="Copy link"
            >
              <FaLink />
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="wishlist-controls-bar">
            <label className="wishlist-search">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved pieces..."
              />
            </label>

            <label className="wishlist-select-all">
              <input
                type="checkbox"
                checked={visible.length > 0 && selected.length === visible.length}
                onChange={() =>
                  setSelected(
                    selected.length === visible.length ? [] : visible.map((x) => x._id)
                  )
                }
              />{' '}
              Select All ({visible.length})
            </label>
          </div>
        )}

        {message && <p className="wishlist-message">{message}</p>}

        {loading ? (
          <div className="product-loading-screen">
            <div className="luxury-spinner" />
            <p>Loading your saved pieces...</p>
          </div>
        ) : !visible.length ? (
          <div className="empty-wishlist-card">
            <Heart size={44} className="empty-wishlist-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Explore our latest jewelry collections and save your favorite pieces.</p>
            <Link to="/collections" className="explore-catalog-btn">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {visible.map((item) => {
              const variant = item.product.variants?.find((x) => x._id === item.variantId)
              const displayPrice = variant?.price ?? item.product.price
              return (
                <article className="wishlist-card" key={item._id}>
                  <div className="wishlist-image">
                    <Link to={`/products/${item.product.slug}`}>
                      <img
                        src={src(item.product.images?.[0])}
                        alt={item.product.title}
                      />
                    </Link>
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() =>
                        setSelected((x) =>
                          x.includes(item._id)
                            ? x.filter((id) => id !== item._id)
                            : [...x, item._id]
                        )
                      }
                    />
                    <button onClick={() => void remove(item._id)} title="Remove item">
                      <X size={18} />
                    </button>
                  </div>
                  <Link to={`/products/${item.product.slug}`} className="wishlist-card-title">
                    <h2>{item.product.title}</h2>
                  </Link>
                  {variant?.name && <p className="wishlist-variant">{variant.name}</p>}
                  <b className="wishlist-price">{money(displayPrice)}</b>

                  <div className="wishlist-quantity">
                    <button
                      disabled={item.quantity === 1}
                      onClick={() => void quantity(item, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => void quantity(item, item.quantity + 1)}>+</button>
                  </div>

                  <button className="wishlist-cart" onClick={() => void move(item)}>
                    <ShoppingBag size={14} />
                    <span>Move to bag</span>
                  </button>
                </article>
              )
            })}
          </div>
        )}

        {recommended.length > 0 && (
          <section className="wishlist-recommendations">
            <h2 className="wishlist-recommendation">You May Also Like</h2>
            <div className="wishlist-recommendation-grid">
              {recommended.map((p) => (
                <Link
                  to={`/products/${p.slug}`}
                  className="wishlist-recommendation-card"
                  key={p._id}
                >
                  <img src={src(p.images?.[0])} alt={p.title} />
                  <h3>{p.title}</h3>
                  <b>{money(p.price)}</b>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </StoreShell>
  )
}

export { WishlistPage }
