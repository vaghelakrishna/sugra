import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard, { type Product } from './ProductCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface CategoryProductsProps {
  categorySlug: string
  title: string
  subtitle?: string
}

export default function CategoryProductsSection({
  categorySlug,
  title,
  subtitle = 'CURATED COLLECTION',
}: CategoryProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true)
      try {
        const response = await fetch(`${API}/products?category=${categorySlug}&limit=6`)
        const body = await response.json()
        if (response.ok && Array.isArray(body.data)) {
          setProducts(body.data)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    void loadCategoryProducts()
  }, [categorySlug])

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-[#faf8f5] py-8 sm:py-12 border-t border-[#f0eae2]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#875c35] mb-1">
              {subtitle}
            </p>
            <h2 className="font-serif text-[24px] sm:text-[32px] font-normal text-[#1f1a17] tracking-tight leading-none">
              {title}
            </h2>
          </div>

          <Link
            to={`/collections/all?category=${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#875c35] hover:text-[#1f1a17] transition-colors"
          >
            Explore All {title} <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div
            className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[220px] md:auto-cols-[240px] gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2"
            style={{ gridAutoFlow: 'column' }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse bg-white p-2.5 rounded-lg border border-[#eee6dc]">
                <div className="aspect-[3/4] bg-[#eee6dc] rounded-md mb-2" />
                <div className="h-3.5 bg-[#eee6dc] rounded-xs w-3/4 mb-1.5" />
                <div className="h-3.5 bg-[#eee6dc] rounded-xs w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[220px] md:auto-cols-[240px] gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2"
            style={{ gridAutoFlow: 'column' }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} badge={title.split(' ')[0].toUpperCase()} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

