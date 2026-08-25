import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, X, ChevronRight, ChevronLeft, Plus, Minus } from 'lucide-react'

type SearchProduct = { _id: string; slug: string; title: string; price: number; images?: string[] }
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const productImage = (image?: string) => {
  if (!image || /^https?:\/\//i.test(image) || image.startsWith('data:')) return image
  return `${API.replace(/\/api\/?$/, '')}/${image.replace(/^\/+/, '')}`
}

export const categories = [
  { name: 'Rings', links: ['All Rings', 'Adjustable Rings', 'Crystal Rings', 'Statement Rings'], image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80' },
  { name: 'Earrings', links: ['All Earrings', 'Stud Earrings', 'Hoop Earrings', 'Statement Earrings'], image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80' },
  { name: 'Necklaces', links: ['All Necklaces', 'Chains', 'Pendants', 'Layered Necklaces'], image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80' },
  { name: 'Bracelets', links: ['All Bracelets', 'Cuffs', 'Chains', 'Charm Bracelets'], image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Watches', links: ['All Watches', 'Classic Watches', 'Minimal Watches', 'Gift Watches'], image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Mystery Jar', links: ['Discover the Jar', 'Gold Surprises', 'Everyday Favourites', 'Gift a Jar'], image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80' },
  { name: 'Mystery Scoop', links: ['Discover the Scoop', 'Lucky Dip', 'Best Value', 'Gift a Scoop'], image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80' },
]

export default function StoreHeader() {
  const navigate = useNavigate()

  // Mobile Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerLevel, setDrawerLevel] = useState<'main' | 'shop_by' | 'category' | 'our_collection' | 'rakhi'>('main')
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)

  // Search State
  const [searchOpen, setSearchOpen] = useState(true) // Visible search row like Screenshot 3
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

  const closeDrawer = () => {
    setDrawerOpen(false)
    setDrawerLevel('main')
    setExpandedSubmenu(null)
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const term = search.trim()
    if (term) navigate(`/collections/all?search=${encodeURIComponent(term)}`)
    else navigate('/collections/all')
    closeDrawer()
  }

  // Handle outside click for mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          setCartCount(body.data?.summary?.itemCount || 0)
        }
      } catch { setCartCount(0) }
    }
    void loadCartCount()
    window.addEventListener('cart:updated', loadCartCount)
    return () => window.removeEventListener('cart:updated', loadCartCount)
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
          1. MAIN HEADER ROW (SCREENSHOT 3)
          ========================================================================= */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 h-14 sm:h-18 flex items-center justify-between">
        {/* LEFT: HAMBURGER ICON */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-1 text-[#111] hover:text-[#875c35] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        {/* CENTER: CLEAN BRAND LOGO */}
        <Link
          to="/"
          className="font-sans text-[20px] sm:text-[26px] font-bold tracking-[0.25em] text-[#111] uppercase select-none"
        >
          SUGRA
        </Link>

        {/* RIGHT: SEARCH, BAG & WISHLIST WITH BADGES (SCREENSHOT 3) */}
        <div className="flex items-center gap-3 sm:gap-5 text-[#111]">
          {/* SEARCH TOGGLE */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 hover:text-[#875c35] transition-colors"
            aria-label="Toggle search"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>

          {/* SHOPPING BAG WITH BADGE */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center p-1 hover:text-[#875c35] transition-colors"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111] text-[9px] font-bold text-white leading-none">
              {cartCount}
            </span>
          </Link>

          {/* WISHLIST HEART WITH BADGE (MATCHING SCREENSHOT 3) */}
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
          2. SEARCH ROW (MATCHING SCREENSHOT 3)
          ========================================================================= */}
      {searchOpen && (
        <div className="relative border-t border-[#f0f0f0] bg-white px-4 sm:px-8 py-2.5">
          <div className="mx-auto max-w-[1440px]">
            <form onSubmit={submitSearch} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Search size={17} className="text-[#666] shrink-0" strokeWidth={1.75} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH FOR..."
                  className="w-full bg-transparent font-sans text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-[#222] placeholder:text-[#888] outline-none"
                  autoFocus={false}
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

            {/* AUTOCOMPLETE DROPDOWN */}
            {search.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-50 border-b border-[#e6ded7] bg-white shadow-xl max-h-96 overflow-y-auto">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-4">
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
                            <img
                              className="h-11 w-9 object-cover rounded-xs"
                              src={productImage(product.images?.[0])}
                              alt=""
                            />
                          ) : (
                            <div className="h-11 w-9 bg-[#eee4db] rounded-xs" />
                          )}
                          <div className="flex-1">
                            <span className="block text-[13px] font-medium text-[#222]">
                              {product.title}
                            </span>
                            <span className="text-[12px] font-semibold text-[#875c35]">
                              Rs. {Number(product.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={() => void submitSearch({ preventDefault: () => undefined } as React.FormEvent<HTMLFormElement>)}
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
          3. DESKTOP MEGA MENU NAVIGATION (HORIZONTAL)
          ========================================================================= */}
      <nav
        className="hidden md:flex justify-center border-t border-[#f0f0f0] bg-white px-4 text-[13px] font-medium tracking-[0.14em] uppercase text-[#333]"
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="flex gap-8 lg:gap-12">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => { setActiveCategory(cat.name); setMegaOpen(true) }}
            >
              <Link
                to={`/collections/all?category=${cat.name.toLowerCase()}`}
                className={`flex h-11 items-center transition-colors hover:text-[#875c35] ${
                  activeCategory === cat.name && megaOpen ? 'text-[#875c35] border-b-2 border-[#111]' : ''
                }`}
              >
                {cat.name}
              </Link>
            </div>
          ))}
        </div>

        {/* MEGA DROPDOWN BOX */}
        {megaOpen && (
          <div
            className="absolute left-0 right-0 top-full z-40 border-b border-[#eee] bg-white py-8 shadow-xl"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <div className="mx-auto max-w-[1280px] px-8 grid grid-cols-[1fr_240px_240px] gap-8">
              <div>
                <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-[#111] mb-4">
                  {selectedCategory.name} Styles
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

              <Link
                to={`/collections/all?category=${selectedCategory.name.toLowerCase()}&sort=newest`}
                onClick={() => setMegaOpen(false)}
                className="group block"
              >
                <img
                  src={selectedCategory.image}
                  alt=""
                  className="aspect-[3/4] w-full rounded-md object-cover transition-transform group-hover:scale-105"
                />
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-[#333] mt-2">
                  New Collection
                </span>
              </Link>

              <Link
                to={`/collections/all?category=${selectedCategory.name.toLowerCase()}&sort=bestsellers`}
                onClick={() => setMegaOpen(false)}
                className="group block"
              >
                <img
                  src={selectedCategory.image}
                  alt=""
                  className="aspect-[3/4] w-full rounded-md object-cover transition-transform group-hover:scale-105"
                />
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-[#333] mt-2">
                  Bestsellers
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          4. MOBILE SLIDE-OVER DRAWER (MATCHING SCREENSHOT 1 & 2)
          ========================================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* BACKDROP OVERLAY */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          {/* SLIDE-IN WHITE DRAWER FROM LEFT */}
          <div className="relative z-50 w-[88vw] max-w-[360px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* DRAWER TOP BAR: CLOSE ICON (MATCHING SCREENSHOT 1 & 2) */}
            <div className="p-5 border-b border-[#f0f0f0] flex items-center justify-between">
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1 text-[#111] hover:text-[#875c35]"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* ===================================================================
                LEVEL 1: MAIN NAVIGATION LIST (SCREENSHOT 1)
                =================================================================== */}
            {drawerLevel === 'main' && (
              <div className="px-6 py-2 flex-1 divide-y divide-[#f0f0f0]">
                {/* 1. JEWELLERY */}
                <Link
                  to="/collections/all"
                  onClick={closeDrawer}
                  className="block py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  JEWELLERY
                </Link>

                {/* 2. SHOP BY > */}
                <button
                  type="button"
                  onClick={() => setDrawerLevel('shop_by')}
                  className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  <span>SHOP BY</span>
                  <ChevronRight size={16} className="text-[#888]" />
                </button>

                {/* 3. CATEGORY > */}
                <button
                  type="button"
                  onClick={() => setDrawerLevel('category')}
                  className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  <span>CATEGORY</span>
                  <ChevronRight size={16} className="text-[#888]" />
                </button>

                {/* 4. BESTSELLERS */}
                <Link
                  to="/collections/all?sort=bestsellers"
                  onClick={closeDrawer}
                  className="block py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  BESTSELLERS
                </Link>

                {/* 5. NEW IN */}
                <Link
                  to="/collections/all?sort=newest"
                  onClick={closeDrawer}
                  className="block py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  NEW IN
                </Link>

                {/* 6. OUR COLLECTION > */}
                <button
                  type="button"
                  onClick={() => setDrawerLevel('our_collection')}
                  className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  <span>OUR COLLECTION</span>
                  <ChevronRight size={16} className="text-[#888]" />
                </button>

                {/* 7. RAKHI > */}
                <button
                  type="button"
                  onClick={() => setDrawerLevel('rakhi')}
                  className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  <span>RAKHI</span>
                  <ChevronRight size={16} className="text-[#888]" />
                </button>

                {/* 8. VIP MEMBERSHIP (GOLD COLOR) */}
                <Link
                  to="/vip-membership"
                  onClick={closeDrawer}
                  className="block py-4 text-[13px] font-bold tracking-[0.18em] uppercase text-[#d4a34b] hover:text-[#b58a4c]"
                >
                  VIP MEMBERSHIP
                </Link>

                {/* 9. TRACK ORDER */}
                <Link
                  to="/track-order"
                  onClick={closeDrawer}
                  className="block py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222] hover:text-[#875c35]"
                >
                  TRACK ORDER
                </Link>
              </div>
            )}

            {/* ===================================================================
                LEVEL 2: DRILL-DOWN SUBMENU (SCREENSHOT 2)
                =================================================================== */}
            {drawerLevel !== 'main' && (
              <div className="px-6 py-2 flex-1">
                {/* BACK BUTTON (MATCHING SCREENSHOT 2: < SHOP BY) */}
                <button
                  type="button"
                  onClick={() => setDrawerLevel('main')}
                  className="flex items-center gap-2 py-4 text-[12px] font-medium tracking-[0.2em] uppercase text-[#555] border-b border-[#eee] w-full"
                >
                  <ChevronLeft size={16} />
                  <span>
                    {drawerLevel === 'shop_by' && 'SHOP BY'}
                    {drawerLevel === 'category' && 'CATEGORY'}
                    {drawerLevel === 'our_collection' && 'OUR COLLECTION'}
                    {drawerLevel === 'rakhi' && 'RAKHI'}
                  </span>
                </button>

                {/* ACCORDION MENU LIST WITH PLUS (+) ICONS (SCREENSHOT 2) */}
                <div className="divide-y divide-[#f0f0f0] mt-2">
                  {/* STYLE + */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedSubmenu(expandedSubmenu === 'style' ? null : 'style')}
                      className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222]"
                    >
                      <span>STYLE</span>
                      {expandedSubmenu === 'style' ? <Minus size={15} /> : <Plus size={15} />}
                    </button>
                    {expandedSubmenu === 'style' && (
                      <div className="pl-4 pb-3 space-y-2.5 text-xs uppercase tracking-wider text-[#666]">
                        <Link to="/collections/all?style=minimal" onClick={closeDrawer} className="block hover:text-black">Minimalist</Link>
                        <Link to="/collections/all?style=statement" onClick={closeDrawer} className="block hover:text-black">Statement</Link>
                        <Link to="/collections/all?style=bold-links" onClick={closeDrawer} className="block hover:text-black">Bold Links</Link>
                        <Link to="/collections/all?style=everyday" onClick={closeDrawer} className="block hover:text-black">Everyday Wear</Link>
                      </div>
                    )}
                  </div>

                  {/* OCCASIONS + */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedSubmenu(expandedSubmenu === 'occasions' ? null : 'occasions')}
                      className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222]"
                    >
                      <span>OCCASIONS</span>
                      {expandedSubmenu === 'occasions' ? <Minus size={15} /> : <Plus size={15} />}
                    </button>
                    {expandedSubmenu === 'occasions' && (
                      <div className="pl-4 pb-3 space-y-2.5 text-xs uppercase tracking-wider text-[#666]">
                        <Link to="/collections/all?occasion=festive" onClick={closeDrawer} className="block hover:text-black">Festive</Link>
                        <Link to="/collections/all?occasion=party" onClick={closeDrawer} className="block hover:text-black">Party Wear</Link>
                        <Link to="/collections/all?occasion=vacation" onClick={closeDrawer} className="block hover:text-black">Vacation</Link>
                        <Link to="/collections/all?occasion=office" onClick={closeDrawer} className="block hover:text-black">Office Wear</Link>
                        <Link to="/collections/all?occasion=gifting" onClick={closeDrawer} className="block hover:text-black">Gifting with love</Link>
                      </div>
                    )}
                  </div>

                  {/* MATERIALS + */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedSubmenu(expandedSubmenu === 'materials' ? null : 'materials')}
                      className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222]"
                    >
                      <span>MATERIALS</span>
                      {expandedSubmenu === 'materials' ? <Minus size={15} /> : <Plus size={15} />}
                    </button>
                    {expandedSubmenu === 'materials' && (
                      <div className="pl-4 pb-3 space-y-2.5 text-xs uppercase tracking-wider text-[#666]">
                        <Link to="/collections/all?material=18k-gold" onClick={closeDrawer} className="block hover:text-black">18K Gold Plated</Link>
                        <Link to="/collections/all?material=anti-tarnish" onClick={closeDrawer} className="block hover:text-black">Anti-Tarnish</Link>
                        <Link to="/collections/all?material=waterproof" onClick={closeDrawer} className="block hover:text-black">100% Waterproof</Link>
                        <Link to="/collections/all?material=stainless-steel" onClick={closeDrawer} className="block hover:text-black">Hypoallergenic Steel</Link>
                      </div>
                    )}
                  </div>

                  {/* COLLECTIONS + */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedSubmenu(expandedSubmenu === 'collections' ? null : 'collections')}
                      className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222]"
                    >
                      <span>COLLECTIONS</span>
                      {expandedSubmenu === 'collections' ? <Minus size={15} /> : <Plus size={15} />}
                    </button>
                    {expandedSubmenu === 'collections' && (
                      <div className="pl-4 pb-3 space-y-2.5 text-xs uppercase tracking-wider text-[#666]">
                        <Link to="/collections/all?category=rings" onClick={closeDrawer} className="block hover:text-black">Rings</Link>
                        <Link to="/collections/all?category=earrings" onClick={closeDrawer} className="block hover:text-black">Earrings</Link>
                        <Link to="/collections/all?category=necklaces" onClick={closeDrawer} className="block hover:text-black">Necklaces</Link>
                        <Link to="/collections/all?category=bracelets" onClick={closeDrawer} className="block hover:text-black">Bracelets</Link>
                      </div>
                    )}
                  </div>

                  {/* PRICE + */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedSubmenu(expandedSubmenu === 'price' ? null : 'price')}
                      className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.18em] uppercase text-[#222]"
                    >
                      <span>PRICE</span>
                      {expandedSubmenu === 'price' ? <Minus size={15} /> : <Plus size={15} />}
                    </button>
                    {expandedSubmenu === 'price' && (
                      <div className="pl-4 pb-3 space-y-2.5 text-xs uppercase tracking-wider text-[#666]">
                        <Link to="/collections/all?maxPrice=999" onClick={closeDrawer} className="block hover:text-black">Under Rs. 999</Link>
                        <Link to="/collections/all?minPrice=1000&maxPrice=1999" onClick={closeDrawer} className="block hover:text-black">Rs. 1,000 - Rs. 1,999</Link>
                        <Link to="/collections/all?minPrice=2000" onClick={closeDrawer} className="block hover:text-black">Above Rs. 2,000</Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM FEATURED VISUAL PHOTO CARDS (MATCHING SCREENSHOT 2) */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#eee]">
                  <Link
                    to="/collections/all?category=earrings"
                    onClick={closeDrawer}
                    className="block aspect-[4/5] rounded-md overflow-hidden bg-[#f0eae2] shadow-xs"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
                      alt="Earrings collection"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <Link
                    to="/collections/all?category=necklaces"
                    onClick={closeDrawer}
                    className="block aspect-[4/5] rounded-md overflow-hidden bg-[#f0eae2] shadow-xs"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                      alt="Necklaces collection"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
