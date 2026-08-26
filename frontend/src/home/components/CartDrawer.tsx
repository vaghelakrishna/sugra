import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Trash2, ShoppingBag, ArrowRight, Shield, Sparkles, Tag, Gift, Plus, Minus } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface CartItem {
  product: {
    _id: string
    title: string
    slug: string
    price: number
    compareAtPrice?: number
    images?: string[]
    sku?: string
    material?: string
  }
  quantity: number
  unitPrice: number
  lineTotal: number
  selectedVariant?: {
    name: string
    value: string
  }
}

interface CartData {
  _id?: string
  items: CartItem[]
  summary?: {
    itemCount: number
    subtotal: number
    discount: number
    total: number
  }
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [giftBox, setGiftBox] = useState(false)
  const [giftNote, setGiftNote] = useState('')
  const [showGiftOptions, setShowGiftOptions] = useState(false)

  const loadCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCart({ items: [], summary: { itemCount: 0, subtotal: 0, discount: 0, total: 0 } })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json()
      if (res.ok) {
        setCart(body.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      void loadCart()
    }
  }, [isOpen])

  const updateQuantity = async (productId: string, newQty: number) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${API}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQty }),
      })
      if (res.ok) {
        const body = await res.json()
        setCart(body.data)
        window.dispatchEvent(new Event('cart:updated'))
      }
    } catch {
      // ignore
    }
  }

  const removeItem = async (productId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${API}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const body = await res.json()
        setCart(body.data)
        window.dispatchEvent(new Event('cart:updated'))
      }
    } catch {
      // ignore
    }
  }

  if (!isOpen) return null

  const items = cart?.items || []
  const subtotal = cart?.summary?.subtotal || items.reduce((sum, item) => sum + (item.lineTotal || item.unitPrice * item.quantity), 0)
  const freeShippingThreshold = 999
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal)
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (coupon.trim().toUpperCase() === 'FIRST10' || coupon.trim().toUpperCase() === 'SUGRA10') {
      setCouponApplied(true)
    } else {
      alert('Invalid promo code. Try "SUGRA10" for 10% off!')
    }
  }

  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const finalTotal = subtotal - discountAmount + (giftBox ? 99 : 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* DRAWER CONTAINER */}
      <aside className="relative z-50 w-full max-w-[440px] h-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* =========================================================================
            1. HEADER
            ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#f0eae2] flex items-center justify-between bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#1a1613]" />
            <h2 className="font-serif text-[18px] font-medium text-[#1a1613] tracking-wide uppercase">
              Shopping Bag ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#555] hover:text-[#111] hover:bg-white rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================================================================
            2. FREE SHIPPING PROGRESS BAR (PALMONAS STYLE)
            ========================================================================= */}
        <div className="bg-[#fff9f2] border-b border-[#f5ebd9] px-4 sm:px-5 py-3">
          {amountNeeded > 0 ? (
            <p className="text-[12px] font-medium text-[#6e461f] text-center mb-1.5">
              Add <span className="font-bold text-[#b47e43]">Rs. {amountNeeded.toLocaleString('en-IN')}</span> more to unlock <span className="font-bold">FREE Express Delivery</span>!
            </p>
          ) : (
            <p className="text-[12px] font-bold text-emerald-700 text-center mb-1.5 flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> You've unlocked FREE Express Delivery!
            </p>
          )}
          <div className="w-full bg-[#ebdccb] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#b47e43] to-[#875c35] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* =========================================================================
            3. CART ITEMS FEED
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#f0eae2] space-y-4">
          {loading ? (
            <div className="py-20 text-center text-xs uppercase tracking-widest text-[#888]">
              Loading your bag...
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#faf7f3] flex items-center justify-center text-[#999] mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-serif text-[18px] text-[#111] uppercase tracking-wide">Your Bag is Empty</h3>
              <p className="text-[13px] text-[#666] mt-1 max-w-[260px] mx-auto">
                Discover waterproof, 18K gold-plated demi-fine jewelry crafted for everyday luxury.
              </p>
              <button
                type="button"
                onClick={() => { onClose(); navigate('/collections/all') }}
                className="mt-6 inline-flex items-center gap-2 bg-[#111] hover:bg-[#875c35] text-white px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] rounded-xs transition-colors"
              >
                <span>Shop Bestsellers</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const p = item.product || {}
              const img = p.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
              return (
                <div key={idx} className="pt-4 first:pt-0 flex gap-3.5">
                  {/* THUMBNAIL */}
                  <Link
                    to={`/products/${p.slug}`}
                    onClick={onClose}
                    className="h-20 w-20 sm:h-22 sm:w-22 shrink-0 rounded-xs overflow-hidden border border-[#eee] bg-[#faf8f5]"
                  >
                    <img src={img} alt={p.title} className="h-full w-full object-cover" />
                  </Link>

                  {/* INFO & ACTIONS */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${p.slug}`}
                          onClick={onClose}
                          className="font-serif text-[13px] sm:text-[14px] font-medium text-[#111] hover:text-[#875c35] line-clamp-1 leading-snug"
                        >
                          {p.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(p._id)}
                          className="text-[#999] hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {p.material && (
                        <span className="text-[11px] text-[#777] block mt-0.5">{p.material}</span>
                      )}

                      {/* PRICE */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-sans text-[13px] font-bold text-[#111]">
                          Rs. {Number(item.unitPrice || p.price).toLocaleString('en-IN')}
                        </span>
                        {p.compareAtPrice && p.compareAtPrice > (item.unitPrice || p.price) && (
                          <span className="font-sans text-[11px] text-[#888] line-through">
                            Rs. {Number(p.compareAtPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* QUANTITY PICKER */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#ddd] rounded-xs bg-[#faf8f5]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(p._id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-[#555] hover:text-[#111] hover:bg-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-[12px] font-bold text-[#111]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(p._id, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#555] hover:text-[#111] hover:bg-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-sans text-[13px] font-bold text-[#875c35]">
                        Rs. {(Number(item.unitPrice || p.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* PALMONAS STYLE GIFT PACKAGING & NOTE */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-[#f0eae2]">
              <button
                type="button"
                onClick={() => setShowGiftOptions(!showGiftOptions)}
                className="w-full flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-[#333] hover:text-[#875c35]"
              >
                <span className="flex items-center gap-2">
                  <Gift size={15} className="text-[#875c35]" /> Add Gift Packaging &amp; Note
                </span>
                <span className="text-xs">{showGiftOptions ? '▲' : '▼'}</span>
              </button>

              {showGiftOptions && (
                <div className="mt-3 p-3 bg-[#faf8f5] rounded-xs border border-[#eee] space-y-2.5">
                  <label className="flex items-center gap-2 text-[12px] font-medium text-[#444] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={giftBox}
                      onChange={(e) => setGiftBox(e.target.checked)}
                      className="accent-[#875c35]"
                    />
                    <span>Luxury Velvet Gift Box (+Rs. 99)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write a personalized gift message..."
                    className="w-full p-2 text-xs border border-[#ddd] rounded-xs bg-white focus:outline-none focus:border-[#875c35]"
                  />
                </div>
              )}
            </div>
          )}

          {/* PROMO COUPON CODE */}
          {items.length > 0 && (
            <div className="pt-3 border-t border-[#f0eae2]">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="ENTER COUPON (SUGRA10)"
                    className="w-full pl-8 pr-2 py-2 text-[11px] font-bold uppercase tracking-wider border border-[#ddd] rounded-xs focus:outline-none focus:border-[#875c35]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#faf8f5] hover:bg-[#111] hover:text-white border border-[#ddd] text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponApplied && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  ✓ 10% Discount Applied (-Rs. {discountAmount.toLocaleString('en-IN')})
                </p>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            4. FOOTER & CHECKOUT ACTION
            ========================================================================= */}
        {items.length > 0 && (
          <div className="border-t border-[#f0eae2] bg-[#faf8f5] p-4 sm:p-5 space-y-3">
            {/* TOTALS */}
            <div className="space-y-1 text-[13px]">
              <div className="flex justify-between text-[#666]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-Rs. {discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {giftBox && (
                <div className="flex justify-between text-[#666]">
                  <span>Luxury Gift Box</span>
                  <span>+Rs. 99</span>
                </div>
              )}
              <div className="flex justify-between text-[#666]">
                <span>Shipping</span>
                <span>{amountNeeded === 0 ? <strong className="text-emerald-700">FREE</strong> : 'Calculated at checkout'}</span>
              </div>
              <div className="flex justify-between font-serif text-[16px] sm:text-[18px] font-bold text-[#111] pt-2 border-t border-[#ebdccb]">
                <span>Estimated Total</span>
                <span>Rs. {finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/checkout')
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-[#875c35] text-white py-3.5 px-6 font-sans text-[13px] font-bold uppercase tracking-[0.2em] rounded-xs shadow-md transition-all hover:shadow-lg active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            {/* TRUST BADGES */}
            <div className="pt-2 flex items-center justify-around text-[10px] uppercase font-bold tracking-wider text-[#777]">
              <span className="flex items-center gap-1">💧 Waterproof</span>
              <span>•</span>
              <span className="flex items-center gap-1">✨ Anti-Tarnish</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Shield size={11} /> 18K Gold Plated</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

