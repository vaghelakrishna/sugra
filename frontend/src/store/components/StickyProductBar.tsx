import { useEffect, useState } from 'react'
import { ShoppingBag, Zap } from 'lucide-react'
import { src, money } from '../utils'
import type { Product } from '../types'

interface StickyProductBarProps {
  product: Product
  currentPrice: number
  onAddToBag: () => void
  onBuyNow: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

export default function StickyProductBar({
  product,
  currentPrice,
  onAddToBag,
  onBuyNow,
  triggerRef,
}: StickyProductBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      // If the main action button has scrolled above the viewport, show sticky bar
      if (rect.bottom < 0) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerRef])

  if (!isVisible) return null

  return (
    <div className="sticky-product-bar">
      <div className="sticky-bar-container">
        <div className="sticky-product-info">
          {product.images?.[0] && (
            <img
              src={src(product.images[0])}
              alt={product.title}
              className="sticky-thumb"
            />
          )}
          <div className="sticky-text">
            <span className="sticky-title">{product.title}</span>
            <span className="sticky-price">{money(currentPrice)}</span>
          </div>
        </div>

        <div className="sticky-actions">
          <button
            type="button"
            className="sticky-add-btn"
            onClick={onAddToBag}
          >
            <ShoppingBag size={16} />
            <span>Add to Bag</span>
          </button>
          <button
            type="button"
            className="sticky-buy-btn"
            onClick={onBuyNow}
          >
            <Zap size={16} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

