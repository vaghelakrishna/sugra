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

  // Mobile Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

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

  const closeDrawer = () => {
    setDrawerOpen(false)
    setExpandedSection(null)
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
      {/* 1. MAIN HEADER ROW */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 h-14 sm:h-18 flex items-center justify-between">
        {/* MOBILE MENU TRIGGER BUTTON (Hidden on Desktop) */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-1 text-[#111] hover:text-[#875c35] transition-colors md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        {/* BRAND LOGO */}
        <Link
          to="/"
          className="font-sans text-[20px] sm:text-[26px] font-bold tracking-[0.25em] text-[#111] uppercase select-none mx-auto md:mx-0"
        >
          SUGRA
        </Link>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3 sm:gap-5 text-[#111]">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1 hover:text-[#875c35] transition-colors"
            aria-label="Toggle search"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>

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

      {/* 2. SEARCH ROW */}
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

      {/* 3. DESKTOP MEGA MENU (Visible ONLY on Desktop/Laptop) */}
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
                <img src={selectedCategory.image} alt="" className="aspect-[3/4] w-full rounded-md object-cover transition-transform group-hover:scale-105" />
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-[#333] mt-2">New Collection</span>
              </Link>
              <Link
                to={`/collections/all?category=${selectedCategory.name.toLowerCase()}&sort=bestsellers`}
                onClick={() => setMegaOpen(false)}
                className="group block"
              >
                <img src={selectedCategory.image} alt="" className="aspect-[3/4] w-full rounded-md object-cover transition-transform group-hover:scale-105" />
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-[#333] mt-2">Bestsellers</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 4. MOBILE SLIDE-OVER DRAWER (Visible ONLY on Mobile via md:hidden) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={closeDrawer} />

          <div className="relative z-50 w-[90vw] max-w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* TOP CLOSE BAR */}
            <div className="p-4 border-b border-[#f0f0f0] flex items-center justify-end sticky top-0 bg-white z-10">
              <button type="button" onClick={closeDrawer} className="p-1 text-[#111] hover:text-[#875c35]">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* SINGLE VERTICAL MOBILE LIST CONTAINING ALL SECTIONS */}
            <div className="px-4 py-2 flex-1 divide-y divide-[#e5e0dc]">
              
              {/* 1. Shop by Category */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'category' ? null : 'category')}
                  className="w-full flex items-center justify-between py-3 text-[14px] font-bold tracking-wide text-[#111]"
                >
                  <span>Shop by Category</span>
                  {expandedSection === 'category' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {expandedSection === 'category' && (
                  <div className="pb-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Necklaces & Chains', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', query: 'necklaces' },
                        { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=300&q=80', query: 'bracelets' },
                        { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80', query: 'earrings' },
                        { name: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80', query: 'rings' },
                        { name: "Men's Chains", img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80', query: 'mens-chains' },
                        { name: 'Jewellery Sets', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80', query: 'sets' },
                        { name: 'Anklets', img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=300&q=80', query: 'anklets' },
                        { name: 'Mangalsutras', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', query: 'mangalsutra' },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={`/collections/all?category=${item.query}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-2 bg-[#f7f5f2] rounded-md hover:bg-[#efece6] transition-colors"
                        >
                          <span className="text-[11px] font-semibold text-[#111] leading-tight pr-1">{item.name}</span>
                          <img src={item.img} alt="" className="w-10 h-10 object-cover rounded-xs shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link to="/collections/all" onClick={closeDrawer} className="block text-center text-xs font-bold uppercase tracking-wider text-[#111] underline mt-3">
                      View all
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. Shop by Occasion */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'occasion' ? null : 'occasion')}
                  className="w-full flex items-center justify-between py-3 text-[14px] font-bold tracking-wide text-[#111]"
                >
                  <span>Shop by Occasion</span>
                  {expandedSection === 'occasion' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {expandedSection === 'occasion' && (
                  <div className="pb-3 pt-1 space-y-2 text-xs uppercase tracking-wider text-[#444]">
                    <Link to="/collections/all?occasion=party" onClick={closeDrawer} className="block py-1 hover:text-black">Party Wear</Link>
                    <Link to="/collections/all?occasion=festive" onClick={closeDrawer} className="block py-1 hover:text-black">Festive Special</Link>
                    <Link to="/collections/all?occasion=office" onClick={closeDrawer} className="block py-1 hover:text-black">Office Chic</Link>
                    <Link to="/collections/all?occasion=vacation" onClick={closeDrawer} className="block py-1 hover:text-black">Vacation Vibe</Link>
                  </div>
                )}
              </div>

              {/* 3. Shop by Collection */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'collection' ? null : 'collection')}
                  className="w-full flex items-center justify-between py-3 text-[14px] font-bold tracking-wide text-[#111]"
                >
                  <span>Shop by Collection</span>
                  {expandedSection === 'collection' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {expandedSection === 'collection' && (
                  <div className="pb-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'AM To PM Collection', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80', query: 'am-pm' },
                        { name: 'Emily In Paris', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80', query: 'emily-in-paris' },
                        { name: 'Signature Collection', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', query: 'signature' },
                        { name: 'Forever Casual', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=300&q=80', query: 'forever-casual' },
                        { name: 'On You Collection', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80', query: 'on-you' },
                        { name: 'Pearl Collection', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80', query: 'pearl' },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={`/collections/all?collection=${item.query}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-2 bg-[#f7f5f2] rounded-md hover:bg-[#efece6] transition-colors"
                        >
                          <span className="text-[11px] font-semibold text-[#111] leading-tight pr-1">{item.name}</span>
                          <img src={item.img} alt="" className="w-10 h-10 object-cover rounded-xs shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link to="/collections/all" onClick={closeDrawer} className="block text-center text-xs font-bold uppercase tracking-wider text-[#111] underline mt-3">
                      View all
                    </Link>
                  </div>
                )}
              </div>

              {/* 4. Shop by Gender */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'gender' ? null : 'gender')}
                  className="w-full flex items-center justify-between py-3 text-[14px] font-bold tracking-wide text-[#111]"
                >
                  <span>Shop by Gender</span>
                  {expandedSection === 'gender' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {expandedSection === 'gender' && (
                  <div className="pb-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Men', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80', query: 'men' },
                        { name: 'Women', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', query: 'women' },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={`/collections/all?gender=${item.query}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-2 bg-[#f7f5f2] rounded-md hover:bg-[#efece6] transition-colors"
                        >
                          <span className="text-[11px] font-semibold text-[#111] leading-tight pr-1">{item.name}</span>
                          <img src={item.img} alt="" className="w-10 h-10 object-cover rounded-xs shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link to="/collections/all" onClick={closeDrawer} className="block text-center text-xs font-bold uppercase tracking-wider text-[#111] underline mt-3">
                      View all
                    </Link>
                  </div>
                )}
              </div>

              {/* 5. Gifting */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'gifting' ? null : 'gifting')}
                  className="w-full flex items-center justify-between py-3 text-[14px] font-bold tracking-wide text-[#111]"
                >
                  <span>Gifting</span>
                  {expandedSection === 'gifting' ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {expandedSection === 'gifting' && (
                  <div className="pb-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Gifts for Sister', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', query: 'sister' },
                        { name: 'Gifts for Brother', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80', query: 'brother' },
                        { name: 'Gift Cards', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80', query: 'gift-cards' },
                        { name: 'Gifts for Mother', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80', query: 'mother' },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={`/collections/all?gifting=${item.query}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-2 bg-[#f7f5f2] rounded-md hover:bg-[#efece6] transition-colors"
                        >
                          <span className="text-[11px] font-semibold text-[#111] leading-tight pr-1">{item.name}</span>
                          <img src={item.img} alt="" className="w-10 h-10 object-cover rounded-xs shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. New Arrivals Link */}
              <div className="py-3">
                <Link
                  to="/collections/all?sort=newest"
                  onClick={closeDrawer}
                  className="block text-[14px] font-bold tracking-wide text-[#111] hover:text-[#875c35]"
                >
                  New Arrivals
                </Link>
              </div>

              {/* 7. Track Order Link */}
              <div className="py-3">
                <Link
                  to="/track-order"
                  onClick={closeDrawer}
                  className="block text-[14px] font-bold tracking-wide text-[#111] hover:text-[#875c35]"
                >
                  Track Order
                </Link>
              </div>


             

            </div>
          </div>
        </div>
      )}
    </header>
  )
}