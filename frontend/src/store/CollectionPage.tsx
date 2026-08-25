import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import StoreShell from './StoreShell'
import { API } from './utils'
import type { Category, Product } from './types'
import {
  ChevronDown,
  X,
  LayoutGrid,
  Grid2X2,
  Grid3X3,
  SlidersHorizontal,
  Check,
  Square,
} from 'lucide-react'
import ProductCard from '../home/components/ProductCard'
import './StorePages.css'

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // Filter Drawer & Sort Dropdown State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  // Grid view options matching the 3 screenshots: '3col' (large), '4col' (standard), '6col' (compact)
  const [viewColumns, setViewColumns] = useState<'single' | '2col' | '3col' | '4col' | '6col'>('4col')

  const sortRefMobile = useRef<HTMLDivElement>(null)
  const sortRefDesktop = useRef<HTMLDivElement>(null)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const style = searchParams.get('style') || ''
  const occasion = searchParams.get('occasion') || ''

  useEffect(() => {
    fetch(API + '/categories')
      .then((r) => r.json())
      .then((b) => setCategories(b.data || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({ limit: '36', page: String(page), sort })
    if (category) query.set('category', category)
    if (search) query.set('search', search)
    if (minPrice) query.set('minPrice', minPrice)
    if (maxPrice) query.set('maxPrice', maxPrice)
    if (style) query.set('style', style)
    if (occasion) query.set('occasion', occasion)

    fetch(API + '/products?' + query)
      .then((r) => r.json())
      .then((b) => {
        setProducts(b.data || [])
        setPages(b.pagination?.pages || 1)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, search, page, sort, minPrice, maxPrice, style, occasion])

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isMobileClick = sortRefMobile.current && sortRefMobile.current.contains(e.target as Node)
      const isDesktopClick = sortRefDesktop.current && sortRefDesktop.current.contains(e.target as Node)
      if (!isMobileClick && !isDesktopClick) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') {
      next.delete('page')
    }
    setSearchParams(next)
  }

  const clearAllFilters = () => {
    setSearchParams({})
    setFilterDrawerOpen(false)
  }

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Best Selling', value: 'bestsellers' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ]

  const activeSortLabel = sortOptions.find((o) => o.value === sort)?.label || 'Sort By'

  return (
    <StoreShell>
      <div className="bg-white min-h-screen">
        {/* =========================================================================
            1. CATEGORY / COLLECTION HEADER BANNER
            ========================================================================= */}
        <div className="text-center py-6 sm:py-8 border-b border-[#f0eae2] bg-[#faf8f5]">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#875c35] mb-1">
            THE COLLECTION
          </p>
          <h1 className="font-serif text-[22px] sm:text-[32px] font-normal text-[#1a1613] tracking-tight uppercase">
            {style
              ? style.replace(/-/g, ' ')
              : category
              ? category.replace(/-/g, ' ')
              : search
              ? `Search: “${search}”`
              : 'All Jewellery'}
          </h1>
        </div>

        {/* =========================================================================
            2A. MOBILE TOOLBAR (EXACT MATCH FOR MOBILE SCREENSHOT)
            ========================================================================= */}
        <div className="md:hidden sticky top-14 z-30 bg-white border-t border-b border-[#e5e5e5] shadow-2xs">
          <div className="grid grid-cols-[1fr_1fr_auto] items-stretch">
            {/* FILTER BUTTON */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center justify-center gap-1.5 py-3.5 px-3 text-[11px] font-medium tracking-[0.2em] uppercase text-[#333] hover:bg-[#faf7f3] transition-colors border-r border-[#e5e5e5]"
            >
              <SlidersHorizontal size={13} className="text-[#666]" />
              <span>FILTER</span>
              {(category || minPrice || maxPrice || style || occasion) && (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#111] text-[8px] font-bold text-white leading-none">
                  !
                </span>
              )}
            </button>

            {/* SORT BY ∨ BUTTON */}
            <div ref={sortRefMobile} className="relative flex items-stretch">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="w-full flex items-center justify-center gap-1.5 py-3.5 px-3 text-[11px] font-medium tracking-[0.2em] uppercase text-[#333] hover:bg-[#faf7f3] transition-colors"
              >
                <span>SORT BY</span>
                <ChevronDown size={13} className={`text-[#666] transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* MOBILE SORT DROPDOWN */}
              {sortDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border border-[#e5e5e5] shadow-xl z-50 py-1.5 divide-y divide-[#f5f5f5]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFilter('sort', opt.value)
                        setSortDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-[10px] uppercase tracking-wider transition-colors ${
                        sort === opt.value ? 'bg-[#faf6f0] font-bold text-[#875c35]' : 'text-[#444] hover:bg-[#fcfbf9]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sort === opt.value && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MOBILE GRID VIEW TOGGLES */}
            <div className="flex items-center gap-2.5 px-3 border-l border-[#e5e5e5]">
              <button
                type="button"
                onClick={() => setViewColumns('single')}
                className={`p-1 ${viewColumns === 'single' ? 'text-[#333]' : 'text-[#aaa]'}`}
                aria-label="Single column"
              >
                <Square size={15} className={viewColumns === 'single' ? 'fill-[#666] text-[#666]' : ''} />
              </button>
              <button
                type="button"
                onClick={() => setViewColumns('2col')}
                className={`p-1 ${viewColumns === '2col' || viewColumns === '4col' ? 'text-[#111]' : 'text-[#aaa]'}`}
                aria-label="2 columns"
              >
                <LayoutGrid size={16} className={viewColumns === '2col' || viewColumns === '4col' ? 'fill-[#111] text-[#111]' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2B. LAPTOP & DESKTOP TOOLBAR (EXACT MATCH FOR SCREENSHOT 1, 2, 3)
            ========================================================================= */}
        <div className="hidden md:block sticky top-18 z-30 bg-white border-t border-b border-[#e5e5e5] shadow-2xs">
          <div className="mx-auto max-w-[1720px] flex items-center justify-between h-13 px-4 sm:px-8">
            {/* LEFT: 3 GRID VIEW ICONS (3-COL, 4-COL, 6-COL) WITH VERTICAL DIVIDER */}
            <div className="flex items-center gap-4 pr-6 border-r border-[#e5e5e5] h-full">
              {/* ICON 1: 3-COLUMNS LARGE VIEW (IMAGE 1) */}
              <button
                type="button"
                onClick={() => setViewColumns('3col')}
                className={`p-1.5 transition-all ${
                  viewColumns === '3col'
                    ? 'opacity-100 text-[#111] scale-110'
                    : 'opacity-40 hover:opacity-80 text-[#555]'
                }`}
                title="3 Columns (Large View - Image 1)"
                aria-label="3 Columns View"
              >
                <Grid2X2 size={18} className={viewColumns === '3col' ? 'fill-[#111] text-[#111]' : ''} />
              </button>

              {/* ICON 2: 4-COLUMNS STANDARD VIEW (IMAGE 2) */}
              <button
                type="button"
                onClick={() => setViewColumns('4col')}
                className={`p-1.5 transition-all ${
                  viewColumns === '4col'
                    ? 'opacity-100 text-[#111] scale-110'
                    : 'opacity-40 hover:opacity-80 text-[#555]'
                }`}
                title="4 Columns (Standard View - Image 2)"
                aria-label="4 Columns View"
              >
                <LayoutGrid size={18} className={viewColumns === '4col' ? 'fill-[#111] text-[#111]' : ''} />
              </button>

              {/* ICON 3: 6-COLUMNS COMPACT VIEW (IMAGE 3) */}
              <button
                type="button"
                onClick={() => setViewColumns('6col')}
                className={`p-1.5 transition-all ${
                  viewColumns === '6col'
                    ? 'opacity-100 text-[#111] scale-110'
                    : 'opacity-40 hover:opacity-80 text-[#555]'
                }`}
                title="6 Columns (Compact View - Image 3)"
                aria-label="6 Columns View"
              >
                <Grid3X3 size={19} className={viewColumns === '6col' ? 'fill-[#111] text-[#111]' : ''} />
              </button>
            </div>

            {/* CENTER: PRODUCT COUNT (MATCHING SCREENSHOT: "37 PRODUCTS") */}
            <div className="font-sans text-[11px] lg:text-[12px] font-medium tracking-[0.22em] uppercase text-[#666] select-none">
              {products.length} PRODUCTS
            </div>

            {/* RIGHT: SORT BY ∨ + DIVIDER + FILTER */}
            <div className="flex items-center h-full">
              {/* SORT BY ∨ */}
              <div ref={sortRefDesktop} className="relative h-full flex items-stretch">
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2.5 px-6 text-[12px] font-medium tracking-[0.2em] uppercase text-[#333] hover:bg-[#faf7f3] transition-colors border-l border-[#e5e5e5] h-full"
                >
                  <span>{activeSortLabel}</span>
                  <ChevronDown size={14} className={`text-[#666] transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* DESKTOP SORT DROPDOWN */}
                {sortDropdownOpen && (
                  <div className="absolute top-full right-0 w-56 bg-white border border-[#e5e5e5] shadow-xl z-50 py-2 divide-y divide-[#f5f5f5]">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFilter('sort', opt.value)
                          setSortDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[11px] uppercase tracking-wider transition-colors ${
                          sort === opt.value
                            ? 'bg-[#faf6f0] font-bold text-[#875c35]'
                            : 'text-[#444] hover:bg-[#fcfbf9]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sort === opt.value && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* FILTER BUTTON */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="flex items-center gap-2.5 px-6 text-[12px] font-medium tracking-[0.2em] uppercase text-[#333] hover:bg-[#faf7f3] transition-colors border-l border-[#e5e5e5] h-full"
              >
                <span>FILTER</span>
                {(category || minPrice || maxPrice || style || occasion) && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111] text-[9px] font-bold text-white leading-none">
                    !
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {(category || search || minPrice || maxPrice || style || occasion) && (
          <div className="mx-auto max-w-[1720px] px-4 sm:px-8 py-3 flex items-center gap-2 flex-wrap border-b border-[#f0eae2]">
            <span className="text-[11px] uppercase tracking-wider text-[#888]">Active Filters:</span>
            {style && (
              <span className="inline-flex items-center gap-1 bg-[#f5efe6] px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#333] rounded-xs">
                Style: {style.replace(/-/g, ' ')}
                <button type="button" onClick={() => setFilter('style', '')} className="hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 bg-[#f5efe6] px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#333] rounded-xs">
                Category: {category}
                <button type="button" onClick={() => setFilter('category', '')} className="hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}
            {minPrice && (
              <span className="inline-flex items-center gap-1 bg-[#f5efe6] px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#333] rounded-xs">
                Min: Rs. {minPrice}
                <button type="button" onClick={() => setFilter('minPrice', '')} className="hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center gap-1 bg-[#f5efe6] px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#333] rounded-xs">
                Max: Rs. {maxPrice}
                <button type="button" onClick={() => setFilter('maxPrice', '')} className="hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] uppercase tracking-wider text-[#875c35] underline ml-2 hover:text-[#111]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* =========================================================================
            3. PRODUCT GRID / DYNAMIC COLUMN SWITCHING (MATCHING IMAGES 1, 2, 3)
            ========================================================================= */}
        <div className="mx-auto max-w-[1720px] px-4 sm:px-8 py-8 sm:py-12">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="animate-pulse bg-[#faf8f5] p-3 rounded-lg border border-[#eee6dc]">
                  <div className="aspect-square bg-[#eee6dc] rounded-md mb-3" />
                  <div className="h-4 bg-[#eee6dc] rounded-xs w-3/4 mb-2" />
                  <div className="h-4 bg-[#eee6dc] rounded-xs w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#faf8f5] rounded-xl border border-[#eee6dc] max-w-lg mx-auto">
              <h3 className="font-serif text-xl text-[#333] mb-2">No Products Found</h3>
              <p className="text-xs text-[#777] mb-6">Try clearing or changing your filters.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-block bg-[#111] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#875c35]"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid transition-all duration-300 ${
                viewColumns === 'single'
                  ? 'grid-cols-1 max-w-xl mx-auto gap-6'
                  : viewColumns === '2col'
                  ? 'grid-cols-2 gap-3 sm:gap-6'
                  : viewColumns === '3col'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
                  : viewColumns === '6col'
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-[#eee]">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFilter('page', String(i + 1))}
                  className={`h-9 w-9 rounded-sm flex items-center justify-center text-xs font-bold transition-all ${
                    page === i + 1
                      ? 'bg-[#111] text-white'
                      : 'bg-[#faf8f5] text-[#333] hover:bg-[#ece4dc]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            4. SLIDE-OVER FILTER DRAWER
            ========================================================================= */}
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* BACKDROP */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setFilterDrawerOpen(false)}
            />

            {/* DRAWER FROM RIGHT */}
            <div className="relative z-50 w-[88vw] max-w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 ml-auto">
              {/* DRAWER TOP BAR */}
              <div className="p-5 border-b border-[#eee] flex items-center justify-between">
                <h3 className="font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-[#111]">
                  FILTERS
                </h3>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-[#666] hover:text-[#111]"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* DRAWER CONTENT */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto divide-y divide-[#f0eae2]">
                {/* 1. CATEGORIES */}
                <div>
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#222] mb-3">
                    Category
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer text-xs uppercase tracking-wider text-[#555] hover:text-black">
                      <input
                        type="radio"
                        name="cat"
                        checked={!category}
                        onChange={() => setFilter('category', '')}
                        className="accent-black"
                      />
                      <span>All Categories</span>
                    </label>
                    {categories.map((c) => (
                      <label key={c._id} className="flex items-center gap-3 cursor-pointer text-xs uppercase tracking-wider text-[#555] hover:text-black">
                        <input
                          type="radio"
                          name="cat"
                          checked={category === c.slug}
                          onChange={() => setFilter('category', c.slug)}
                          className="accent-black"
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. PRICE RANGE */}
                <div className="pt-6">
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#222] mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => { setFilter('minPrice', ''); setFilter('maxPrice', '999') }}
                      className={`block w-full text-left text-xs uppercase tracking-wider py-2 px-3 rounded-xs transition-colors ${
                        maxPrice === '999' ? 'bg-[#111] text-white font-bold' : 'text-[#555] hover:bg-[#faf7f3]'
                      }`}
                    >
                      Under Rs. 999
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('minPrice', '1000'); setFilter('maxPrice', '1999') }}
                      className={`block w-full text-left text-xs uppercase tracking-wider py-2 px-3 rounded-xs transition-colors ${
                        minPrice === '1000' ? 'bg-[#111] text-white font-bold' : 'text-[#555] hover:bg-[#faf7f3]'
                      }`}
                    >
                      Rs. 1,000 - Rs. 1,999
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('minPrice', '2000'); setFilter('maxPrice', '') }}
                      className={`block w-full text-left text-xs uppercase tracking-wider py-2 px-3 rounded-xs transition-colors ${
                        minPrice === '2000' ? 'bg-[#111] text-white font-bold' : 'text-[#555] hover:bg-[#faf7f3]'
                      }`}
                    >
                      Above Rs. 2,000
                    </button>
                  </div>
                </div>

                {/* 3. SORT BY */}
                <div className="pt-6">
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#222] mb-3">
                    Sort By
                  </h4>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer text-xs uppercase tracking-wider text-[#555] hover:text-black">
                        <input
                          type="radio"
                          name="sortOpt"
                          checked={sort === opt.value}
                          onChange={() => setFilter('sort', opt.value)}
                          className="accent-black"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* DRAWER BOTTOM ACTIONS */}
              <div className="p-4 border-t border-[#eee] bg-[#faf8f5] flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-[#666] border border-[#ccc] hover:bg-white transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#111] hover:bg-[#875c35] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  )
}

export { CollectionPage }
