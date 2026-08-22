import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import StoreShell from './StoreShell'
import { API, src, money } from './utils'
import type { Category, Product } from './types'
import './StorePages.css'

export default function CollectionPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const isCatalog = location.pathname.endsWith('/all')
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page') || 1)
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    fetch(API + '/categories')
      .then((r) => r.json())
      .then((b) => setCategories(b.data || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!isCatalog) return

    setLoading(true)
    const query = new URLSearchParams({ limit: '12', page: String(page), sort })
    if (category) query.set('category', category)
    if (search) query.set('search', search)
    if (minPrice) query.set('minPrice', minPrice)
    if (maxPrice) query.set('maxPrice', maxPrice)

    fetch(API + '/products?' + query)
      .then((r) => r.json())
      .then((b) => {
        setProducts(b.data || [])
        setPages(b.pagination?.pages || 1)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [isCatalog, category, search, page, sort, minPrice, maxPrice])

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

  if (!isCatalog) {
    return (
      <StoreShell>
        <main className="shop collection-landing">
          <p className="eyebrow">THE COLLECTION</p>
          <h1>Shop by category.</h1>
          <p className="collection-intro">Choose a collection to explore our pieces.</p>
          <div className="category-grid">
            {categories.map((item) => (
              <Link to={`/collections/all?category=${item.slug}`} key={item._id}>
                <img src={src(item.image)} alt={item.name} />
                <h2>{item.name}</h2>
              </Link>
            ))}
          </div>
          <Link className="catalog-link" to="/collections/all">
            View all products
          </Link>
        </main>
      </StoreShell>
    )
  }

  return (
    <StoreShell>
      <main className="shop catalog-page">
        <p className="eyebrow">THE COLLECTION</p>
        <h1>{search ? `Results for “${search}”` : 'All products'}</h1>
        <div className="catalog-layout">
          <aside className="catalog-filters">
            <label>
              Category
              <select value={category} onChange={(e) => setFilter('category', e.target.value)}>
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option value={item.slug} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Min price
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setFilter('minPrice', e.target.value)}
              />
            </label>
            <label>
              Max price
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setFilter('maxPrice', e.target.value)}
              />
            </label>
            <button onClick={() => setSearchParams({})}>Clear filters</button>
          </aside>
          <section>
            <div className="catalog-toolbar">
              <span>{loading ? 'Loading...' : `${products.length} products`}</span>
              <select value={sort} onChange={(e) => setFilter('sort', e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
            {(category || search || minPrice || maxPrice) && (
              <div className="filter-chips">
                {category && (
                  <button onClick={() => setFilter('category', '')}>{category} ×</button>
                )}
                {search && <button onClick={() => setFilter('search', '')}>{search} ×</button>}
                {minPrice && (
                  <button onClick={() => setFilter('minPrice', '')}>Min {minPrice} ×</button>
                )}
                {maxPrice && (
                  <button onClick={() => setFilter('maxPrice', '')}>Max {maxPrice} ×</button>
                )}
              </div>
            )}
            {!loading && !products.length ? (
              <p>No products found.</p>
            ) : (
              <div className="products">
                {products.map((p) => (
                  <Link to={`/products/${p.slug}`} key={p._id}>
                    <img src={src(p.images?.[0])} alt={p.title} />
                    <small>{p.category?.name || 'SUGRA'}</small>
                    <h2>{p.title}</h2>
                    <b>{money(p.price)}</b>
                  </Link>
                ))}
              </div>
            )}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, index) => (
                  <button
                    className={page === index + 1 ? 'active' : ''}
                    onClick={() => setFilter('page', String(index + 1))}
                    key={index}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </StoreShell>
  )
}

export { CollectionPage }

