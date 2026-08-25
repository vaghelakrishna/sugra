import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard, { type Product } from './ProductCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API}/products?limit=8&sort=newest`)
      const body = await response.json()
      if (!response.ok) throw new Error(body.message || 'Unable to load products')
      setProducts(Array.isArray(body.data) ? body.data : [])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  return (
    <section className="bg-white py-6 sm:py-8 border-t border-[#f0eae2]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#875c35] mb-1">
              JUST DROPPED
            </p>
            <h2 className="font-serif text-[24px] sm:text-[32px] font-normal text-[#1f1a17] tracking-tight leading-none">
              New Arrivals
            </h2>
          </div>

          <Link
            to="/collections/all?sort=newest"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#875c35] hover:text-[#1f1a17] transition-colors"
          >
            Shop All Pieces <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div
            className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[220px] md:auto-cols-[240px] gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2"
            style={{ gridAutoFlow: 'column' }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse bg-[#faf8f5] p-2.5 rounded-lg border border-[#eee6dc]">
                <div className="aspect-[3/4] bg-[#eee6dc] rounded-md mb-2" />
                <div className="h-3.5 bg-[#eee6dc] rounded-xs w-3/4 mb-1.5" />
                <div className="h-3.5 bg-[#eee6dc] rounded-xs w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-[#faf8f5] rounded-lg border border-[#ede6de]">
            <p className="text-red-700 text-xs mb-2">{error}</p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="text-[11px] font-bold uppercase tracking-wider text-[#875c35] underline"
            >
              Try loading again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 bg-[#faf8f5] rounded-lg border border-[#ede6de]">
            <p className="text-[#786c62] text-xs">New pieces are arriving soon.</p>
          </div>
        ) : (
          /* COMPACT SLEEK GRID WITH GRID-AUTO-FLOW: COLUMN AND FIXED CARD SIZES */
          <div
            className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[220px] md:auto-cols-[240px] gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2"
            style={{ gridAutoFlow: 'column' }}
          >
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} badge="NEW" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
