import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, X, Plus, Minus, User as UserIcon } from 'lucide-react'
import CartDrawer from './CartDrawer'

type SearchProduct = { _id: string; slug: string; title: string; price: number; images?: string[] }
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const productImage = (image?: string) => {
  if (!image || /^https?:\/\//i.test(image) || image.startsWith('data:')) return image
  return `${API.replace(/\/api\/?$/, '')}/${image.replace(/^\/+/, '')}`
}

// 1. Mobile Drawer Categories Grid Data (Matching Screenshot 1)
const mobileCategories = [
  { name: 'Necklaces & Chains', link: '/collections/all?category=necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=260&q=80' },
  { name: 'Bracelets', link: '/collections/all?category=bracelets', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=260&q=80' },
  { name: 'Earrings', link: '/collections/all?category=earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=260&q=80' },
  { name: 'Rings', link: '/collections/all?category=rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=260&q=80' },
  { name: 'Men\'s Chains', link: '/collections/all?category=men', img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=260&q=80' },
  { name: 'Jewellery Sets', link: '/collections/all?category=sets', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=260&q=80' },
  { name: 'Anklets', link: '/collections/all?category=anklets', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=260&q=80' },
  { name: 'Mangalsutras', link: '/collections/all?category=mangalsutra', img: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=260&q=80' },
]

// 2. Mobile Drawer Collections Data (Matching Screenshot 2)
const mobileCollections = [
  { name: 'AM To PM Collection', link: '/collections/all?collection=am-to-pm', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=260&q=80' },
  { name: 'Emily In Paris', link: '/collections/all?collection=emily-in-paris', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=260&q=80' },
  { name: 'Signature Collection', link: '/collections/all?collection=signature', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=260&q=80' },
  { name: 'Forever Casual', link: '/collections/all?collection=forever-casual', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=260&q=80' },
  { name: 'On You Collection', link: '/collections/all?collection=on-you', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=260&q=80' },
  { name: 'Pearl Collection', link: '/collections/all?collection=pearl', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=260&q=80' },
]

// 3. Mobile Drawer Genders Data (Matching Screenshot 2)
const mobileGenders = [
  { name: 'Men', link: '/collections/all?gender=men', img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=260&q=80' },
  { name: 'Women', link: '/collections/all?gender=women', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=260&q=80' },
]

// 4. Mobile Drawer Gifting Data (Matching Screenshot 3)
const mobileGifting = [
  { name: 'Gifts for Sister', link: '/collections/all?gift=sister', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=260&q=80' },
  { name: 'Gifts for Brother', link: '/collections/all?gift=brother', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=260&q=80' },
  { name: 'Gift Cards', link: '/collections/all?category=gift-cards', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=260&q=80' },
  { name: 'Gifts for Mother', link: '/collections/all?gift=mother', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=260&q=80' },
]

export const categories = [
  { name: 'Rings', links: ['All Rings', 'Adjustable Rings', 'Crystal Rings', 'Statement Rings'], image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80' },
  { name: 'Earrings', links: ['All Earrings', 'Stud Earrings', 'Hoop Earrings', 'Statement Earrings'], image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80' },
  { name: 'Necklaces', links: ['All Necklaces', 'Chains', 'Pendants', 'Layered Necklaces'], image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80' },
  { name: 'Bracelets', links: ['All Bracelets', 'Cuffs', 'Chains', 'Charm Bracelets'], image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Watches', links: ['All Watches', 'Classic Watches', 'Minimal Watches', 'Gift Watches'], image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80' },
]

export default function StoreHeader() {
  const navigate = useNavigate()

  // Mobile Drawer State & Accordions
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    category: true,
    collection: false,
    gender: false,
    gifting: false,
  })

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Cart Drawer State
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  // Search State
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [searching, setSearching] = useState(false)

  // Desktop Mega Menu State
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Rings')
  const headerRef = useRef<HTMLElement>(null)

  // Bag & Wishlist Counts
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setIsLoggedIn(false)
    setCurrentUser(null)
    setAccountDropdownOpen(false)
    window.dispatchEvent(new Event('cart:updated'))
    window.dispatchEvent(new Event('wishlist:updated'))
    navigate('/')
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const term = search.trim()
    if (term) navigate(`/collections/all?search=${encodeURIComponent(term)}`)
    else navigate('/collections/all')
    closeDrawer()
    setSearchOpen(false)
  }

  const handleViewAllResults = () => {
    const term = search.trim()
    if (term) navigate(`/collections/all?search=${encodeURIComponent(term)}`)
    else navigate('/collections/all')
    setSearch('')
    setSearchOpen(false)
    closeDrawer()
  }

  // Outside click for mega menu & account dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMegaOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check auth
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token')
      const storedUser = localStorage.getItem('user') || localStorage.getItem('admin_user')
      setIsLoggedIn(Boolean(token))
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser))
        } catch {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }
    checkAuth()
    window.addEventListener('auth:updated', checkAuth)
    return () => window.removeEventListener('auth:updated', checkAuth)
  }, [])

  // Live search debouncing
  useEffect(() => {
    const term = search.trim()
    if (term.length < 2) { setResults([]); setSearching(false); return }
    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(`${API}/products?limit=5&search=${encodeURIComponent(term)}`, { signal: controller.signal })
        const body = await response.json()
        if (response.ok) setResults(body.data || [])
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setResults([])
      } finally { if (!controller.signal.aborted) setSearching(false) }
    }, 250)
    return () => { window.clearTimeout(timeout); controller.abort() }
  }, [search])

  // Load cart count
  useEffect(() => {
    const loadCartCount = async () => {
      const token = localStorage.getItem('token')
      if (!token) return setCartCount(0)
      try {
        const response = await fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } })
        if (response.ok) {
          const body = await response.json()
          setCartCount(body.data?.summary?.itemCount || (body.data?.items || []).length || 0)
        }
      } catch { setCartCount(0) }
    }
    void loadCartCount()
    const handleOpenCart = () => setCartDrawerOpen(true)
    window.addEventListener('cart:updated', loadCartCount)
    window.addEventListener('cart:open', handleOpenCart)
    return () => {
      window.removeEventListener('cart:updated', loadCartCount)
      window.removeEventListener('cart:open', handleOpenCart)
    }
  }, [])

  // Load wishlist count
  useEffect(() => {
    const loadWishlistCount = async () => {
      const token = localStorage.getItem('token')
      if (!token) return setWishlistCount(0)
      try {
        const response = await fetch(`${API}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
        if (response.ok) {
          const body = await response.json()
          setWishlistCount((body.data?.items || []).length)
        }
      } catch { setWishlistCount(0) }
    }
    void loadWishlistCount()
    window.addEventListener('wishlist:updated', loadWishlistCount)
    return () => window.removeEventListener('wishlist:updated', loadWishlistCount)
  }, [])

  const selectedCategory = categories.find(category => category.name === activeCategory) || categories[0]

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white border-b border-[#ece8e3] shadow-xs">
      {/* =========================================================================
          1. MAIN TOP HEADER ROW (EXACT MATCH FOR SCREENSHOT 4: AMALFA LOGO + NAV + RIGHT ICONS)
          ========================================================================= */}
      <div className="mx-auto max-w-[1720px] px-4 sm:px-8 h-14 sm:h-18 flex items-center justify-between gap-4">
        {/* MOBILE HAMBURGER MENU BUTTON (Visible up to lg) */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-1 text-[#111] hover:text-[#875c35] transition-colors lg:hidden shrink-0"
          aria-label="Open mobile menu"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        {/* BRAND LOGO: AMALFA */}
        <Link
          to="/"
          className="font-sans text-[20px] sm:text-[25px] font-bold tracking-[0.25em] text-[#111] uppercase select-none shrink-0"
        >
          SUGRA
        </Link>

        {/* DESKTOP CENTER NAVIGATION LINKS (SCREENSHOT 4) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-[12px] font-semibold tracking-[0.15em] uppercase text-[#1a1613] mx-auto">
          {/* JEWELLERY (Opens Mega Menu) */}
          <div
            className="relative cursor-pointer py-5"
            onMouseEnter={() => { setActiveCategory('Rings'); setMegaOpen(true) }}
          >
            <span className={`hover:text-[#875c35] transition-colors ${megaOpen ? 'text-[#875c35]' : ''}`}>
              JEWELLERY
            </span>
          </div>

          {/* SHOP BY */}
          <Link to="/collections/all" className="hover:text-[#875c35] transition-colors">
            SHOP BY
          </Link>

          {/* CATEGORY */}
          <Link to="/collections/all" className="hover:text-[#875c35] transition-colors">
            CATEGORY
          </Link>

          {/* BESTSELLERS */}
          <Link to="/collections/all?sort=bestsellers" className="hover:text-[#875c35] transition-colors">
            BESTSELLERS
          </Link>

          {/* NEW IN */}
          <Link to="/collections/all?sort=newest" className="hover:text-[#875c35] transition-colors">
            NEW IN
          </Link>

          {/* OUR COLLECTION */}
          <Link to="/collections/all?collection=signature" className="hover:text-[#875c35] transition-colors">
            OUR COLLECTION
          </Link>

          {/* RAKHI */}
          <Link to="/collections/all?category=rakhi" className="hover:text-[#875c35] transition-colors">
            RAKHI
          </Link>

          {/* VIP MEMBERSHIP (Gold Styled) */}
          <Link to="/collections/all" className="text-[#b47e43] font-bold hover:text-[#875c35] transition-colors">
            VIP MEMBERSHIP
          </Link>

          {/* TRACK ORDER */}
          <Link to="/track-order" className="hover:text-[#875c35] transition-colors">
            TRACK ORDER
          </Link>
        </nav>

        {/* RIGHT ACTION ICONS: USER, SEARCH, BAG, WISHLIST */}
        <div className="flex items-center gap-3 sm:gap-4 text-[#111] shrink-0">
          {/* USER ACCOUNT ICON & DROPDOWN */}
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="p-1 hover:text-[#875c35] transition-colors flex items-center justify-center"
              title={isLoggedIn ? (currentUser?.name || 'My Account') : 'Account / Sign In'}
              aria-label="Account"
            >
              <UserIcon size={19} strokeWidth={1.75} />
            </button>

            {/* ACCOUNT DROPDOWN MENU */}
            {accountDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md border border-[#e5ded5] shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-[#f0eae2] bg-[#faf8f5]">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#875c35]">
                        Signed In As
                      </p>
                      <p className="text-[13px] font-semibold text-[#111] truncate mt-0.5">
                        {currentUser?.name || 'Valued Customer'}
                      </p>
                      {currentUser?.email && (
                        <p className="text-[11px] text-[#777] truncate">
                          {currentUser.email}
                        </p>
                      )}
                    </div>

                    <div className="py-1 text-[12px] font-medium text-[#333]">
                      <Link
                        to="/track-order"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#faf7f3] hover:text-[#875c35] transition-colors"
                      >
                        <span>📦</span> Track My Order
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-[#faf7f3] hover:text-[#875c35] transition-colors"
                      >
                        <span className="flex items-center gap-2"><span>❤️</span> My Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="text-[10px] font-bold bg-[#111] text-white px-1.5 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      {currentUser?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#875c35] font-bold hover:bg-[#faf7f3] transition-colors"
                        >
                          <span>⚙️</span> Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-[#f0eae2] pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                      >
                        <span>🚪</span> Log Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2.5 border-b border-[#f0eae2] bg-[#faf8f5]">
                      <p className="text-[12px] font-bold text-[#111]">
                        Welcome to SUGRA JEWELS
                      </p>
                      <p className="text-[11px] text-[#777] mt-0.5">
                        Sign in for fast checkout &amp; order tracking.
                      </p>
                    </div>

                    <div className="py-1 text-[12px] font-medium text-[#333]">
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#faf7f3] hover:text-[#875c35] transition-colors font-semibold"
                      >
                        <span>✨</span> Sign In / Login
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#faf7f3] hover:text-[#875c35] transition-colors"
                      >
                        <span>📝</span> Create New Account
                      </Link>
                      <Link
                        to="/track-order"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#faf7f3] hover:text-[#875c35] transition-colors"
                      >
                        <span>📦</span> Track Order
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#875c35] hover:bg-[#faf7f3] transition-colors text-[11px] font-bold uppercase tracking-wider"
                      >
                        <span>🔒</span> Admin Sign In
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* SEARCH ICON */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 hover:text-[#875c35] transition-colors"
            aria-label="Toggle search"
          >
            <Search size={19} strokeWidth={1.75} />
          </button>

          {/* SHOPPING BAG WITH BADGE (OPENS PALMONAS-STYLE SLIDE-OVER DRAWER) */}
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex items-center justify-center p-1 hover:text-[#875c35] transition-colors"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111] text-[9px] font-bold text-white leading-none">
              {cartCount}
            </span>
          </button>

          {/* WISHLIST HEART WITH BADGE */}
          <Link
            to="/wishlist"
            className="relative flex items-center justify-center p-1 hover:text-[#875c35] transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={20} strokeWidth={1.75} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white leading-none shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. SEARCH ROW STRIP
          ========================================================================= */}
      {searchOpen && (
        <div className="relative border-t border-[#f0f0f0] bg-white px-4 sm:px-8 py-2.5">
          <div className="mx-auto max-w-360">
            <form onSubmit={submitSearch} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Search size={17} className="text-[#666] shrink-0" strokeWidth={1.75} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH FOR..."
                  className="w-full bg-transparent font-sans text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-[#222] placeholder:text-[#888] outline-none"
                  autoFocus={true}
                />
              </div>

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 text-[#666] hover:text-[#111]"
                  aria-label="Clear search"
                >
                  <X size={17} strokeWidth={1.75} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-[#666] hover:text-[#111]"
                  aria-label="Close search"
                >
                  <X size={17} strokeWidth={1.75} />
                </button>
              )}
            </form>

            {search.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-50 border-b border-[#e6ded7] bg-white shadow-xl max-h-96 overflow-y-auto">
                <div className="mx-auto max-w-360 px-4 sm:px-8 py-4">
                  {searching ? (
                    <p className="py-2 text-xs uppercase tracking-wider text-[#888]">Searching...</p>
                  ) : results.length ? (
                    <div className="divide-y divide-[#f0eae2]">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product.slug}`}
                          onClick={() => { setSearch(''); setSearchOpen(false) }}
                          className="flex items-center gap-3 py-2.5 hover:bg-[#faf7f3] transition-colors"
                        >
                          {productImage(product.images?.[0]) ? (
                            <img className="h-11 w-9 object-cover rounded-xs" src={productImage(product.images?.[0])} alt="" />
                          ) : (
                            <div className="h-11 w-9 bg-[#eee4db] rounded-xs" />
                          )}
                          <div className="flex-1">
                            <span className="block text-[13px] font-medium text-[#222]">{product.title}</span>
                            <span className="text-[12px] font-semibold text-[#875c35]">Rs. {Number(product.price).toLocaleString('en-IN')}</span>
                          </div>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={handleViewAllResults}
                        className="w-full pt-3 text-left text-xs font-bold uppercase tracking-wider text-[#875c35] hover:underline"
                      >
                        View all results →
                      </button>
                    </div>
                  ) : (
                    <p className="py-2 text-xs uppercase tracking-wider text-[#888]">No matching products found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. DESKTOP MEGA MENU DROPDOWN
          ========================================================================= */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 top-full z-40 border-b border-[#eee] bg-white py-8 shadow-xl hidden lg:block"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="mx-auto max-w-7xl px-8 grid grid-cols-[200px_1fr_240px_240px] gap-8">
            {/* Category tabs */}
            <div className="space-y-1 border-r border-[#eee] pr-4">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategory(cat.name)}
                  onMouseEnter={() => setActiveCategory(cat.name)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-xs ${activeCategory === cat.name ? 'bg-[#faf7f3] text-[#875c35]' : 'text-[#555] hover:text-[#111]'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sub links */}
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#111] mb-4">
                Popular {selectedCategory.name} Styles
              </h4>
              <div className="space-y-2.5">
                {selectedCategory.links.map((link) => (
                  <Link
                    key={link}
                    to={`/collections/all?category=${selectedCategory.name.toLowerCase()}&style=${link.toLowerCase().replaceAll(' ', '-')}`}
                    onClick={() => setMegaOpen(false)}
                    className="block text-xs uppercase tracking-wider text-[#555] hover:text-[#875c35] transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            {/* Image Tile 1 */}
            <Link
              to={`/collections/all?category=${selectedCategory.name.toLowerCase()}&sort=newest`}
              onClick={() => setMegaOpen(false)}
              className="group block"
            >
              <img src={selectedCategory.image} alt="" className="aspect-3/4 w-full rounded-md object-cover transition-transform group-hover:scale-105" />
              <span className="block text-center text-xs font-semibold uppercase tracking-wider text-[#333] mt-2">New Arrivals</span>
            </Link>

            {/* Image Tile 2 */}
            <Link
              to={`/collections/all?category=${selectedCategory.name.toLowerCase()}&sort=bestsellers`}
              onClick={() => setMegaOpen(false)}
              className="group block"
            >
              <img src={selectedCategory.image} alt="" className="aspect-3/4 w-full rounded-md object-cover transition-transform group-hover:scale-105" />
              <span className="block text-center text-xs font-semibold uppercase tracking-wider text-[#333] mt-2">Bestsellers</span>
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MOBILE HAMBURGER MENU DRAWER (MATCHING SCREENSHOTS 1, 2, 3)
          ========================================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* BACKDROP */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={closeDrawer} />

          {/* SLIDE-IN DRAWER */}
          <div className="relative z-50 w-[92vw] max-w-105 h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* TOP BRAND & CLOSE BAR */}
            <div className="p-4 border-b border-[#f0f0f0] flex items-center justify-between sticky top-0 bg-white z-10">
              <span className="font-sans text-[18px] font-bold tracking-[0.25em] text-[#111] uppercase">
                SUGRA
              </span>
              <button type="button" onClick={closeDrawer} className="p-1 text-[#111] hover:text-[#875c35]">
                <X size={22} />
              </button>
            </div>

            <div className="p-4 space-y-6 flex-1">
              {/* ACCORDION 1: SHOP BY CATEGORY (SCREENSHOT 1) */}
              <div className="border-b border-[#f0f0f0] pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('category')}
                  className="w-full flex items-center justify-between text-[16px] font-serif font-medium text-[#111] tracking-wide mb-3"
                >
                  <span>Shop by Category</span>
                  {openAccordions.category ? <Minus size={18} className="text-[#555]" /> : <Plus size={18} className="text-[#555]" />}
                </button>

                {openAccordions.category && (
                  <div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {mobileCategories.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-3 rounded-md bg-[#f6f6f6] hover:bg-[#eee] transition-colors group"
                        >
                          <span className="text-[13px] font-medium text-[#222] leading-tight pr-2">
                            {item.name}
                          </span>
                          <img
                            src={item.img}
                            alt={item.name}
                            className="h-10 w-10 object-contain shrink-0 group-hover:scale-110 transition-transform"
                          />
                        </Link>
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <Link
                        to="/collections/all"
                        onClick={closeDrawer}
                        className="text-[13px] font-medium text-[#111] underline hover:text-[#875c35]"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 2: SHOP BY COLLECTION (SCREENSHOT 2) */}
              <div className="border-b border-[#f0f0f0] pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('collection')}
                  className="w-full flex items-center justify-between text-[16px] font-serif font-medium text-[#111] tracking-wide mb-3"
                >
                  <span>Shop by Collection</span>
                  {openAccordions.collection ? <Minus size={18} className="text-[#555]" /> : <Plus size={18} className="text-[#555]" />}
                </button>

                {openAccordions.collection && (
                  <div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {mobileCollections.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-3 rounded-md bg-[#f6f6f6] hover:bg-[#eee] transition-colors group"
                        >
                          <span className="text-[13px] font-medium text-[#222] leading-tight pr-2">
                            {item.name}
                          </span>
                          <img
                            src={item.img}
                            alt={item.name}
                            className="h-10 w-10 object-contain shrink-0 group-hover:scale-110 transition-transform"
                          />
                        </Link>
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <Link
                        to="/collections/all"
                        onClick={closeDrawer}
                        className="text-[13px] font-medium text-[#111] underline hover:text-[#875c35]"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 3: SHOP BY GENDER (SCREENSHOT 2) */}
              <div className="border-b border-[#f0f0f0] pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('gender')}
                  className="w-full flex items-center justify-between text-[16px] font-serif font-medium text-[#111] tracking-wide mb-3"
                >
                  <span>Shop by Gender</span>
                  {openAccordions.gender ? <Minus size={18} className="text-[#555]" /> : <Plus size={18} className="text-[#555]" />}
                </button>

                {openAccordions.gender && (
                  <div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {mobileGenders.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-3 rounded-md bg-[#f6f6f6] hover:bg-[#eee] transition-colors group"
                        >
                          <span className="text-[13px] font-medium text-[#222] leading-tight pr-2">
                            {item.name}
                          </span>
                          <img
                            src={item.img}
                            alt={item.name}
                            className="h-10 w-10 object-contain shrink-0 group-hover:scale-110 transition-transform"
                          />
                        </Link>
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <Link
                        to="/collections/all"
                        onClick={closeDrawer}
                        className="text-[13px] font-medium text-[#111] underline hover:text-[#875c35]"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 4: GIFTING (SCREENSHOT 3) */}
              <div className="border-b border-[#f0f0f0] pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('gifting')}
                  className="w-full flex items-center justify-between text-[16px] font-serif font-medium text-[#111] tracking-wide mb-3"
                >
                  <span>Gifting</span>
                  {openAccordions.gifting ? <Minus size={18} className="text-[#555]" /> : <Plus size={18} className="text-[#555]" />}
                </button>

                {openAccordions.gifting && (
                  <div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {mobileGifting.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-3 rounded-md bg-[#f6f6f6] hover:bg-[#eee] transition-colors group"
                        >
                          <span className="text-[13px] font-medium text-[#222] leading-tight pr-2">
                            {item.name}
                          </span>
                          <img
                            src={item.img}
                            alt={item.name}
                            className="h-10 w-10 object-contain shrink-0 group-hover:scale-110 transition-transform"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* STANDALONE QUICK NAV LINKS */}
              <div className="space-y-3 pt-2 font-sans text-[13px] font-semibold tracking-wider uppercase text-[#222]">
                <Link
                  to="/collections/all?sort=bestsellers"
                  onClick={closeDrawer}
                  className="block py-1 hover:text-[#875c35]"
                >
                  Bestsellers
                </Link>
                <Link
                  to="/collections/all?sort=newest"
                  onClick={closeDrawer}
                  className="block py-1 hover:text-[#875c35]"
                >
                  New In
                </Link>
                <Link
                  to="/collections/all?category=rakhi"
                  onClick={closeDrawer}
                  className="block py-1 hover:text-[#875c35]"
                >
                  Rakhi Gifts
                </Link>
                <Link
                  to="/collections/all"
                  onClick={closeDrawer}
                  className="block py-1 text-[#b47e43] font-bold"
                >
                  VIP Membership
                </Link>
                <Link
                  to="/track-order"
                  onClick={closeDrawer}
                  className="block py-1 hover:text-[#875c35]"
                >
                  Track Order
                </Link>
                <Link
                  to={isLoggedIn ? '/account' : '/login'}
                  onClick={closeDrawer}
                  className="block py-1 hover:text-[#875c35] border-t border-[#f0f0f0] pt-3 text-[#875c35]"
                >
                  {isLoggedIn ? 'My Account' : 'Sign In / Register'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. PALMONAS-STYLE SLIDE-OVER CART DRAWER
          ========================================================================= */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  )
}