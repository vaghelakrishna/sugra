import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Heart,
  Share2,
  Star,
  Check,
  Flame,
  Eye,
  Tag,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Zap,
} from 'lucide-react'
import StoreShell from './StoreShell'
import ProductGallery from './components/ProductGallery'
import PincodeChecker from './components/PincodeChecker'
import JewelryTrustBadges from './components/JewelryTrustBadges'
import ProductAccordions from './components/ProductAccordions'
import StickyProductBar from './components/StickyProductBar'
import { API, headers, src, money, cartUpdated, wishlistUpdated } from './utils'
import type { Product, Review, WishlistItem, Variant } from './types'
import './StorePages.css'

export default function ProductPage() {
  const nav = useNavigate()
  const { slug = '' } = useParams()
  const mainActionsRef = useRef<HTMLDivElement>(null)

  const [product, setProduct] = useState<Product>()
  const [reviews, setReviews] = useState<Review[]>([])
  const [related, setRelated] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all')
  const [message, setMessage] = useState('')
  const [wishlist, setWishlist] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [selectedBought, setSelectedBought] = useState<string[]>([])
  const [copiedShare, setCopiedShare] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const checkWishlist = async (productId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setWishlist(false)
      return
    }
    try {
      const r = await fetch(API + '/wishlist', { headers: headers() })
      if (r.ok) {
        const b = await r.json()
        setWishlist(
          (b.data?.items || []).some(
            (item: WishlistItem) => item.product && item.product._id === productId
          )
        )
      }
    } catch {
      setWishlist(false)
    }
  }

  const load = async () => {
    const response = await fetch(API + '/products/' + slug)
    const body = await response.json()
    if (!response.ok) return

    const item = body.data as Product
    setProduct(item)
    if (item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0])
    }

    const [reviewResponse, relatedResponse] = await Promise.all([
      fetch(API + `/products/${item._id}/reviews`),
      fetch(
        API +
        `/products?limit=10${item.category?.name
          ? `&search=${encodeURIComponent(item.category.name)}`
          : ''
        }`
      ),
    ])

    const reviewBody = await reviewResponse.json()
    const relatedBody = await relatedResponse.json()

    setReviews(reviewBody.data || [])
    const filteredRelated = (relatedBody.data || [])
      .filter((entry: Product) => entry._id !== item._id)
      .slice(0, 8)
    setRelated(filteredRelated)

    // Pre-select first 2 frequently bought items
    if (filteredRelated.length > 0) {
      setSelectedBought(filteredRelated.slice(0, 2).map((x: Product) => x._id))
    }

    void checkWishlist(item._id)
  }

  useEffect(() => {
    setQuantity(1)
    setMessage('')
    setShowReviewForm(false)
    void load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  // Price calculations
  const basePrice = selectedVariant?.price ?? product?.price ?? 0
  const mrpPrice =
    product?.compareAtPrice && product.compareAtPrice > basePrice
      ? product.compareAtPrice
      : Math.round(basePrice * 1.25)
  const savings = Math.max(0, mrpPrice - basePrice)
  const discountPercentage =
    mrpPrice > basePrice ? Math.round(((mrpPrice - basePrice) / mrpPrice) * 100) : 0

  const handleAddToCart = async (overrideQty?: number) => {
    if (!product) return
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Please sign in to add items to your bag.')
      return
    }

    setIsAdding(true)
    setMessage('')

    try {
      const response = await fetch(API + '/cart/items', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          productId: product._id,
          variantId: selectedVariant?._id,
          quantity: overrideQty ?? quantity,
        }),
      })

      if (response.ok) {
        cartUpdated()
        setMessage('✨ Added to your shopping bag!')
      } else {
        const err = await response.json().catch(() => ({}))
        setMessage(err.message || 'Unable to add this product to bag.')
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Please sign in before checkout.')
      nav('/login')
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch(API + '/cart/items', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          productId: product._id,
          variantId: selectedVariant?._id,
          quantity,
        }),
      })
      if (response.ok) {
        cartUpdated()
        nav('/checkout')
      } else {
        setMessage('Unable to proceed to checkout.')
      }
    } catch {
      setMessage('Unable to proceed to checkout.')
    } finally {
      setIsAdding(false)
    }
  }

  const toggleWishlist = async () => {
    if (!product) return
    if (!localStorage.getItem('token')) {
      return setMessage('Please sign in to save items to your wishlist.')
    }

    try {
      if (wishlist) {
        const res = await fetch(API + '/wishlist', { headers: headers() })
        const data = await res.json()
        const existingItem = (data.data?.items || []).find(
          (item: WishlistItem) => item.product && item.product._id === product._id
        )
        if (existingItem) {
          const delRes = await fetch(`${API}/wishlist/items/${existingItem._id}`, {
            method: 'DELETE',
            headers: headers(),
          })
          if (delRes.ok) {
            setWishlist(false)
            wishlistUpdated()
            setMessage('Removed from wishlist.')
          } else {
            setMessage('Unable to update wishlist.')
          }
        } else {
          setWishlist(false)
          wishlistUpdated()
          setMessage('Removed from wishlist.')
        }
      } else {
        const response = await fetch(API + '/wishlist/items', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({
            productId: product._id,
            variantId: selectedVariant?._id,
            quantity: 1,
          }),
        })

        if (response.ok) {
          setWishlist(true)
          wishlistUpdated()
          setMessage('❤️ Saved to your wishlist!')
        } else {
          const err = await response.json().catch(() => ({}))
          setMessage(err.message || 'Unable to update wishlist.')
        }
      }
    } catch {
      setMessage('Unable to update wishlist.')
    }
  }

  const handleShare = () => {
    void navigator.clipboard?.writeText(window.location.href)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2500)
  }

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!product) return

    const response = await fetch(API + `/products/${product._id}/reviews`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        rating,
        title: reviewTitle.trim() || undefined,
        comment,
      }),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      return setMessage(body.message || 'Unable to submit review.')
    }

    setComment('')
    setReviewTitle('')
    setShowReviewForm(false)
    setMessage('✨ Thank you! Your review has been submitted.')
    void load()
  }

  // Handle adding bundle (Frequently bought together)
  const handleAddBundle = async () => {
    if (!product || !localStorage.getItem('token')) {
      return setMessage('Please sign in to add bundle to bag.')
    }

    setIsAdding(true)
    try {
      // Add current product
      await fetch(API + '/cart/items', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          productId: product._id,
          variantId: selectedVariant?._id,
          quantity: 1,
        }),
      })

      // Add selected bundle items
      for (const id of selectedBought) {
        await fetch(API + '/cart/items', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ productId: id, quantity: 1 }),
        })
      }

      cartUpdated()
      setMessage(`✨ Added ${selectedBought.length + 1} items to your shopping bag!`)
    } catch {
      setMessage('Failed to add some bundle items.')
    } finally {
      setIsAdding(false)
    }
  }

  if (!product) {
    return (
      <StoreShell>
        <div className="product-loading-screen">
          <div className="luxury-spinner" />
          <p>Curating piece details...</p>
        </div>
      </StoreShell>
    )
  }

  // Review statistics
  const totalReviews = reviews.length
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '4.9'
  const displayReviewCount = totalReviews > 0 ? totalReviews : 42

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      totalReviews > 0
        ? Math.round(
          (reviews.filter((r) => r.rating === star).length / totalReviews) * 100
        )
        : star === 5
          ? 85
          : star === 4
            ? 15
            : 0,
  }))

  const filteredReviews =
    reviewFilter === 'all'
      ? reviews
      : reviews.filter((r) => r.rating === reviewFilter)

  // Frequently bought items calculation
  const frequentlyBought = related.slice(0, 3)
  const bundleTotal =
    basePrice +
    frequentlyBought
      .filter((item) => selectedBought.includes(item._id))
      .reduce((sum, item) => sum + item.price, 0)

  return (
    <StoreShell>
      {/* Breadcrumb Navigation */}
      <nav className="product-breadcrumbs" aria-label="Breadcrumb">
        <div className="breadcrumb-container">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/collections">Collections</Link>
          {product.category?.name && (
            <>
              <span className="breadcrumb-sep">/</span>
              <Link to={`/collections/all?category=${product.category.slug || ''}`}>
                {product.category.name}
              </Link>
            </>
          )}
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.title}</span>
        </div>
      </nav>

      <main className="product-detail-layout">
        {/* Left Column: Interactive Image Gallery */}
        <section className="product-media-column">
          <ProductGallery
            images={product.images}
            title={product.title}
            discountPercentage={discountPercentage}
            isBestseller={true}
          />
        </section>

        {/* Right Column: Product Information & Purchase Flow */}
        <section className="product-content-column">
          <div className="product-header-meta">
            <span className="product-brand-tag">
              {product.category?.name ? `${product.category.name.toUpperCase()} · ` : ''}SUGRA LUXE
            </span>
            <button
              type="button"
              className="product-share-btn"
              onClick={handleShare}
              title="Share this product"
            >
              <Share2 size={16} />
              <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <h1 className="product-main-title">{product.title}</h1>

          {/* Rating Summary Snippet */}
          <div className="product-rating-snippet">
            <div className="stars-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className="star-icon filled"
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="rating-score">{avgRating}</span>
            <span className="rating-count">({displayReviewCount} reviews)</span>
          </div>

          {/* Pricing Block */}
          <div className="product-pricing-card">
            <div className="price-main-line">
              <span className="current-price">{money(basePrice)}</span>
              {mrpPrice > basePrice && (
                <span className="mrp-price">{money(mrpPrice)}</span>
              )}
              {discountPercentage > 0 && (
                <span className="discount-pill">
                  Save {money(savings)} ({discountPercentage}% OFF)
                </span>
              )}
            </div>
            <div className="tax-shipping-note">
              <span>Inclusive of all taxes</span>
              <span className="dot-sep">•</span>
              <span className="free-ship-tag">FREE Express Delivery</span>
            </div>
          </div>

          {/* Real-time Urgency / Scarcity Badge */}
          <div className="product-urgency-strip">
            <div className="urgency-item">
              <Flame size={15} className="flame-icon" />
              <span>
                Selling fast! Only <strong>{product.stock || 4} left</strong> in stock
              </span>
            </div>
            <div className="urgency-item viewers">
              <Eye size={15} className="eye-icon" />
              <span>18 people viewing right now</span>
            </div>
          </div>

          {/* Exclusive Offer Card */}
          <div className="product-offer-banner">
            <div className="offer-tag-icon">
              <Tag size={16} />
            </div>
            <div className="offer-text">
              <strong>EXTRA 10% OFF</strong> on orders above $50. Use code:{' '}
              <span className="coupon-code">SUGRA10</span>
            </div>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="product-variants-section">
              <label className="variant-label">
                Select Option:{' '}
                <strong>{selectedVariant?.name || 'Default'}</strong>
              </label>
              <div className="variant-options-list">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    className={`variant-option-btn ${selectedVariant?._id === v._id ? 'active' : ''
                      }`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    <span>{v.name}</span>
                    {v.price && (
                      <small className="variant-price">{money(v.price)}</small>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="purchase-controls-box" ref={mainActionsRef}>
            <div className="quantity-wrapper">
              <span className="quantity-label">Quantity</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-val">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= (product.stock || 10)}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="action-buttons-group">
              <button
                type="button"
                className="add-bag-primary"
                onClick={() => void handleAddToCart()}
                disabled={isAdding}
              >
                <ShoppingBag size={18} />
                <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
              </button>

              <button
                type="button"
                className={`wishlist-toggle-btn ${wishlist ? 'active' : ''}`}
                onClick={() => void toggleWishlist()}
                title={wishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={20} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              type="button"
              className="buy-now-instant"
              onClick={() => void handleBuyNow()}
              disabled={isAdding}
            >
              <Zap size={18} />
              <span>Instant Buy Now</span>
            </button>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`product-feedback-alert ${message.includes('✨') || message.includes('❤️')
                  ? 'success'
                  : 'error'
                }`}
            >
              <span>{message}</span>
            </div>
          )}

          {/* Pincode & Delivery Checker (Amalfa Style) */}
          <PincodeChecker />

          {/* Luxury Trust Badges Strip */}
          <JewelryTrustBadges />

          {/* Customization / Special Notes */}
          <details className="customization-details">
            <summary>
              <Sparkles size={16} />
              <span>Add Special Gift Note or Customization Request</span>
            </summary>
            <div className="customization-body">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Include a gift message or special packaging instructions..."
                rows={3}
              />
            </div>
          </details>

          {/* Detailed Accordions (Details, Care, Shipping) */}
          <ProductAccordions product={product} />
        </section>
      </main>

      {/* Frequently Bought Together / Complete The Look */}
      {frequentlyBought.length > 0 && (
        <section className="frequently-bought-section">
          <div className="section-container">
            <div className="bundle-header">
              <Sparkles size={20} className="sparkle-icon" />
              <h2>Complete The Look</h2>
              <p>Curated pieces that pair flawlessly with your selection</p>
            </div>

            <div className="bundle-layout">
              {/* Product Cards Row */}
              <div className="bundle-items-row">
                {/* Main Product Card */}
                <div className="bundle-card main">
                  <div className="bundle-thumb">
                    <img
                      src={src(product.images?.[0])}
                      alt={product.title}
                    />
                    <span className="this-item-badge">This Item</span>
                  </div>
                  <div className="bundle-card-info">
                    <h4>{product.title}</h4>
                    <b>{money(basePrice)}</b>
                  </div>
                </div>

                <span className="bundle-plus-sign">+</span>

                {/* Related Pairings */}
                {frequentlyBought.map((item, idx) => {
                  const isChecked = selectedBought.includes(item._id)
                  return (
                    <div key={item._id} className="bundle-item-group">
                      <label className={`bundle-card ${isChecked ? 'selected' : ''}`}>
                        <div className="bundle-checkbox">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setSelectedBought((prev) =>
                                prev.includes(item._id)
                                  ? prev.filter((id) => id !== item._id)
                                  : [...prev, item._id]
                              )
                            }
                          />
                        </div>
                        <div className="bundle-thumb">
                          <img
                            src={src(item.images?.[0])}
                            alt={item.title}
                          />
                        </div>
                        <div className="bundle-card-info">
                          <h4>{item.title}</h4>
                          <b>{money(item.price)}</b>
                        </div>
                      </label>
                      {idx < frequentlyBought.length - 1 && (
                        <span className="bundle-plus-sign">+</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bundle Purchase Callout */}
              <div className="bundle-checkout-box">
                <div className="bundle-price-row">
                  <span className="bundle-label">
                    Bundle Total ({selectedBought.length + 1} items):
                  </span>
                  <span className="bundle-total-price">{money(bundleTotal)}</span>
                </div>
                <button
                  type="button"
                  className="bundle-add-all-btn"
                  onClick={() => void handleAddBundle()}
                  disabled={isAdding}
                >
                  <ShoppingBag size={18} />
                  <span>Add Selected to Bag</span>
                </button>
                <small className="bundle-save-hint">
                  🎉 Free shipping applied on this combo
                </small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section (Judge.me Style) */}
      <section className="customer-reviews-section">
        <div className="section-container">
          <div className="reviews-section-header">
            <div>
              <h2>Customer Reviews</h2>
              <p>Authentic feedback from verified SUGRA customers</p>
            </div>
            <button
              type="button"
              className="write-review-btn"
              onClick={() => setShowReviewForm((v) => !v)}
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Rating Summary Breakdown Card */}
          <div className="reviews-summary-card">
            <div className="summary-score-box">
              <span className="big-rating-number">{avgRating}</span>
              <div className="summary-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="star-icon filled"
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="summary-count">
                Based on {displayReviewCount} reviews
              </span>
            </div>

            <div className="summary-bars-box">
              {starCounts.map(({ star, count, percentage }) => (
                <button
                  key={star}
                  type="button"
                  className={`rating-bar-row ${reviewFilter === star ? 'active-filter' : ''
                    }`}
                  onClick={() =>
                    setReviewFilter((prev) => (prev === star ? 'all' : star))
                  }
                >
                  <span className="bar-star-label">{star} ★</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="bar-percentage-label">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Write Form */}
          {showReviewForm && (
            <form onSubmit={submitReview} className="write-review-form-card">
              <h3>Share your experience</h3>
              <div className="form-rating-picker">
                <span>Your Rating:</span>
                <div className="star-picker-row">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRating(val)}
                      className={`star-pick-btn ${val <= rating ? 'selected' : ''}`}
                    >
                      <Star size={24} fill={val <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review Title (e.g., Stunning sparkle & high quality!)"
                className="review-input"
              />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Write your review here. How was the quality, fit, and packaging?"
                rows={4}
                className="review-textarea"
              />

              <button type="submit" className="review-submit-btn">
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Review Filter Chips */}
          {reviewFilter !== 'all' && (
            <div className="reviews-filter-status">
              <span>Showing only {reviewFilter}-star reviews</span>
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className="clear-filter-btn"
              >
                Show all reviews
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-feed">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <article key={review._id} className="review-card">
                  <div className="review-card-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">
                        {review.user?.name || 'Verified Customer'}
                      </span>
                      <span className="verified-badge">
                        <Check size={12} /> Verified Buyer
                      </span>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="review-stars-row">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`star-icon ${i < review.rating ? 'filled' : 'empty'
                          }`}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  {review.title && (
                    <h4 className="review-title">{review.title}</h4>
                  )}
                  <p className="review-body">{review.comment}</p>
                </article>
              ))
            ) : (
              <div className="no-reviews-box">
                <p>No reviews found matching your filter.</p>
                {reviewFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setReviewFilter('all')}
                    className="reset-filter-btn"
                  >
                    View All Reviews
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products / You May Also Like */}
      {related.length > 0 && (
        <section className="related-products-section">
          <div className="section-container">
            <div className="related-header">
              <h2>You May Also Like</h2>
              <p>Explore matching designs and customer favorites</p>
            </div>
            <div className="related-grid">
              {related.map((item) => (
                <Link
                  to={`/products/${item.slug}`}
                  key={item._id}
                  className="related-product-card"
                >
                  <div className="related-image-wrapper">
                    <img
                      src={src(item.images?.[0])}
                      alt={item.title}
                    />
                  </div>
                  <div className="related-info">
                    <small className="related-category">
                      {item.category?.name || 'SUGRA'}
                    </small>
                    <h3 className="related-title">{item.title}</h3>
                    <div className="related-price-row">
                      <b className="related-price">{money(item.price)}</b>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="related-mrp">
                          {money(item.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Sticky Buy Bar on Scroll */}
      <StickyProductBar
        product={product}
        currentPrice={basePrice}
        onAddToBag={() => void handleAddToCart()}
        onBuyNow={() => void handleBuyNow()}
        triggerRef={mainActionsRef}
      />
    </StoreShell>
  )
}

export { ProductPage }
