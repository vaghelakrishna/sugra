import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Check } from 'lucide-react'

export type Product = {
  _id: string
  slug: string
  title: string
  price: number
  compareAtPrice?: number
  images?: string[]
  category?: { name: string; slug?: string }
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const imageSrc = (path?: string) => {
  if (!path || path.startsWith('data:') || /^https?:\/\//i.test(path)) return path
  return `${API.replace(/\/api\/?$/, '')}/${path.replace(/^\/+/, '')}`
}

export const formatPrice = (value: number) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

export default function ProductCard({
  product,
  badge = 'NEW',
}: {
  product: Product
  badge?: string
}) {
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const img1 = imageSrc(product.images?.[0])
  const img2 = product.images?.[1] ? imageSrc(product.images[1]) : null

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = `/products/${product.slug}`
      return
    }

    try {
      setAdding(true)
      const res = await fetch(`${API}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })
      if (res.ok) {
        setAdded(true)
        window.dispatchEvent(new Event('cart:updated'))
        setTimeout(() => setAdded(false), 2000)
      }
    } catch {
      // ignore
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token) return

    setWishlisted(!wishlisted)
    try {
      if (wishlisted) {
        await fetch(`${API}/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await fetch(`${API}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId: product._id }),
        })
      }
      window.dispatchEvent(new Event('wishlist:updated'))
    } catch {
      // ignore
    }
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-lg bg-white p-2.5 sm:p-3 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-[#ece4dc]">
      <Link to={`/products/${product.slug}`} className="block relative">
        {/* IMAGE WRAPPER WITH 2ND IMAGE HOVER SWAP */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-[#f6f2ec]">
          {img1 ? (
            <>
              {/* PRIMARY IMAGE */}
              <img
                src={img1}
                alt={product.title}
                className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${
                  img2 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                }`}
              />

              {/* SECONDARY IMAGE (SHOWN ON HOVER) */}
              {img2 && (
                <img
                  src={img2}
                  alt={`${product.title} alternate view`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                />
              )}
            </>
          ) : (
            <div className="grid h-full place-items-center text-xs text-[#999]">SUGRA LUXE</div>
          )}

          {/* BADGES */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {badge && (
              <span className="rounded-xs bg-[#1f1a17] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                {badge}
              </span>
            )}
            {discount && (
              <span className="rounded-xs bg-[#9c2727] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* WISHLIST BUTTON */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`absolute top-2 right-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform hover:scale-110 ${
              wishlisted ? 'text-[#a83232]' : 'text-[#443c36] hover:text-[#a83232]'
            }`}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>
        </div>

        {/* DETAILS */}
        <div className="pt-3 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#875c35]">
            {product.category?.name || '18K GOLD PLATED'}
          </p>
          <h3 className="font-serif text-[14px] sm:text-[15px] font-medium text-[#221c18] mt-0.5 line-clamp-1 group-hover:text-[#875c35] transition-colors">
            {product.title}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-sans text-[14px] sm:text-[15px] font-bold text-[#1f1915]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[11px] text-[#9c8e82] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* QUICK ADD BUTTON */}
      <button
        type="button"
        disabled={adding}
        onClick={handleQuickAdd}
        className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-sm py-2 px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all ${
          added
            ? 'bg-[#2e7d52] text-white'
            : 'bg-[#1f1915] text-white hover:bg-[#875c35]'
        }`}
      >
        {added ? (
          <>
            <Check size={13} strokeWidth={2.5} /> ADDED
          </>
        ) : (
          <>
            <ShoppingBag size={13} strokeWidth={1.75} /> QUICK ADD
          </>
        )}
      </button>
    </div>
  )
}
