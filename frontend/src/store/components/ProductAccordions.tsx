import { useState } from 'react'
import { ChevronDown, Sparkles, Shield, Truck } from 'lucide-react'
import type { Product } from '../types'

interface ProductAccordionsProps {
  product: Product
}

export default function ProductAccordions({ product }: ProductAccordionsProps) {
  const [openSection, setOpenSection] = useState<string | null>('details')

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  return (
    <div className="product-accordions">
      {/* 1. Product Details & Specs */}
      <div className={`accordion-item ${openSection === 'details' ? 'open' : ''}`}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => toggle('details')}
          aria-expanded={openSection === 'details'}
        >
          <span className="accordion-title">
            <Sparkles size={18} />
            <span>Product Details & Specifications</span>
          </span>
          <ChevronDown
            size={18}
            className={`accordion-chevron ${openSection === 'details' ? 'rotated' : ''}`}
          />
        </button>
        {openSection === 'details' && (
          <div className="accordion-content">
            {product.description && <p className="accordion-desc">{product.description}</p>}
            <ul className="spec-list">
              <li>
                <strong>Material:</strong> {product.material || '18K Gold Plated Stainless Steel / Brass'}
              </li>
              <li>
                <strong>Finish:</strong> High Polish Anti-Tarnish Coating
              </li>
              {product.category?.name && (
                <li>
                  <strong>Category:</strong> {product.category.name}
                </li>
              )}
              {product.sku && (
                <li>
                  <strong>SKU:</strong> {product.sku}
                </li>
              )}
              <li>
                <strong>Hypoallergenic:</strong> 100% Lead & Nickel Free (Safe for Sensitive Skin)
              </li>
              <li>
                <strong>Closure / Style:</strong> Premium secure comfort fit
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 2. Jewelry Care Guide */}
      <div className={`accordion-item ${openSection === 'care' ? 'open' : ''}`}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => toggle('care')}
          aria-expanded={openSection === 'care'}
        >
          <span className="accordion-title">
            <Shield size={18} />
            <span>Jewelry Care & Longevity</span>
          </span>
          <ChevronDown
            size={18}
            className={`accordion-chevron ${openSection === 'care' ? 'rotated' : ''}`}
          />
        </button>
        {openSection === 'care' && (
          <div className="accordion-content">
            <ul className="care-guide-list">
              <li>
                💧 <strong>Water & Sweat Proof:</strong> Safe for daily splashes, gym, and regular wear.
              </li>
              <li>
                ✨ <strong>Avoid Harsh Chemicals:</strong> Spray perfumes and apply lotions before wearing your jewelry.
              </li>
              <li>
                📦 <strong>Storage:</strong> Store individually in the airtight SUGRA pouch provided to prevent scratches.
              </li>
              <li>
                🧼 <strong>Cleaning:</strong> Gently wipe with a soft dry microfiber cloth after wearing to maintain lustrous shine.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 3. Shipping & Returns */}
      <div className={`accordion-item ${openSection === 'shipping' ? 'open' : ''}`}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => toggle('shipping')}
          aria-expanded={openSection === 'shipping'}
        >
          <span className="accordion-title">
            <Truck size={18} />
            <span>Shipping & Easy Returns</span>
          </span>
          <ChevronDown
            size={18}
            className={`accordion-chevron ${openSection === 'shipping' ? 'rotated' : ''}`}
          />
        </button>
        {openSection === 'shipping' && (
          <div className="accordion-content">
            <ul className="shipping-policy-list">
              <li>
                🚀 <strong>Fast Dispatch:</strong> Orders are processed and dispatched within 24 hours.
              </li>
              <li>
                🚚 <strong>Delivery Timeline:</strong> Typically arrives in 3-5 business days across India.
              </li>
              <li>
                💵 <strong>Cash on Delivery:</strong> Available across most serviceable pincodes.
              </li>
              <li>
                🔄 <strong>7-Day Returns:</strong> If you're not completely in love with your piece, easily request an exchange or return within 7 days of delivery.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

