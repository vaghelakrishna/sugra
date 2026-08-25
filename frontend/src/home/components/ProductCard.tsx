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

export const formatPrice = (value: number) =>
  `Rs ${Number(value || 0).toLocaleString('en-IN')}.00`

export default function ProductCard({
  product,
  badge,
}: {
  product: Product
  badge?: string
}) {
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const img1 = imageSrc(product.images?.[0])
  const img2 = product.images?.[1] ? imageSrc(product.images[1]) : null

  const isOnSale =
    Boolean(product.compareAtPrice && product.compareAtPrice > product.price)

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
    if (!token) {
      setWishlisted(!wishlisted)
      return
    }

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
    <div className="group relative flex flex-col justify-between bg-white transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="block relative">
        {/* =========================================================================
            IMAGE CONTAINER (SQUARE / ASPECT-SQUARE WITH 2ND IMAGE HOVER SWAP)
            ========================================================================= */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#f7f4ee] rounded-xs">
          {img1 ? (
            <>
              {/* PRIMARY IMAGE */}
              <img
                src={img1}
                alt={product.title}
                className={`h-full w-full object-cover object-center transition-all duration-700 ease-in-out ${
                  img2 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                }`}
              />

              {/* SECONDARY IMAGE (SHOWN ON HOVER) */}
              {img2 && (
                <img
                  src={img2}
                  alt={`${product.title} alternate view`}
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                />
              )}
            </>
          ) : (
            <div className="grid h-full place-items-center text-xs text-[#999]">SUGRA JEWELS</div>
          )}

          {/* =====================================================================
              BADGES (ON SALE ON LEFT, NEW IN ON RIGHT - MATCHING SCREENSHOT)
              ===================================================================== */}
          {isOnSale && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="bg-[#191919] text-[#e5a855] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 block shadow-xs">
                ON SALE
              </span>
            </div>
          )}

          {badge ? (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="bg-[#9c182f] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 block shadow-xs">
                {badge}
              </span>
            </div>
          ) : !isOnSale ? (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="bg-[#9c182f] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 block shadow-xs">
                NEW IN
              </span>
            </div>
          ) : null}

          {/* =====================================================================
              RIGHT SIDE WISHLIST BUTTON (TOP-RIGHT / RIGHT SIDE)
              ===================================================================== */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            title="Add to wishlist"
            className={`absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-transform hover:scale-110 ${
              wishlisted ? 'text-[#c92a2a] opacity-100' : 'text-[#333] opacity-0 group-hover:opacity-100 hover:text-[#c92a2a]'
            }`}
          >
            <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>

          {/* =====================================================================
              BOTTOM-RIGHT QUICK BAG BUTTON (MATCHING SCREENSHOT)
              ===================================================================== */}
          <button
            type="button"
            disabled={adding}
            onClick={handleQuickAdd}
            aria-label="Quick add to bag"
            title="Quick add to bag"
            className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center bg-black/90 hover:bg-black text-white shadow-md transition-transform hover:scale-110"
          >
            {added ? (
              <Check size={16} strokeWidth={2.5} className="text-[#4ade80]" />
            ) : (
              <ShoppingBag size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>

        {/* =========================================================================
            PRODUCT DETAILS (MATCHING SCREENSHOT TYPOGRAPHY & PRICING)
            ========================================================================= */}
        <div className="pt-3 pb-1 text-center">
          {/* TITLE */}
          <h3 className="font-sans text-[13px] sm:text-[14px] text-[#222] font-normal leading-snug line-clamp-2 px-1 hover:text-[#875c35] transition-colors">
            {product.title}
          </h3>

          {/* PRICING */}
          <div className="mt-1.5 flex items-center justify-center gap-2 flex-wrap text-[12px] sm:text-[13px]">
            {isOnSale ? (
              <>
                <span className="font-sans font-normal text-[#222]">
                  From {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-sans text-[#888] line-through text-[11px] sm:text-[12px]">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="font-sans font-normal text-[#222]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
