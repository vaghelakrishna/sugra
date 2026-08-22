import { useState, useRef, type MouseEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { src } from '../utils'

interface ProductGalleryProps {
  images?: string[]
  title: string
  discountPercentage?: number
  isBestseller?: boolean
}

export default function ProductGallery({
  images = [],
  title,
  discountPercentage,
  isBestseller = true,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const hasMultipleImages = images && images.length > 1
  const activeImage = images[activeIndex] || images[0]

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div
      className={`product-gallery-wrapper ${
        hasMultipleImages ? 'has-thumbnails' : 'single-image'
      }`}
    >
      {/* Thumbnails list (vertical on desktop, horizontal on mobile) */}
      {hasMultipleImages && (
        <div className="product-gallery-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`gallery-thumb-btn ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={src(img)} alt={`${title} thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Viewer */}
      <div className="product-gallery-main">
        <div
          ref={imageContainerRef}
          className={`gallery-main-image-container ${isZoomed ? 'zoomed' : ''}`}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          {activeImage ? (
            <>
              <img
                src={src(activeImage)}
                alt={title}
                className="gallery-main-img"
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(1.9)',
                      }
                    : undefined
                }
              />
              <button
                type="button"
                className="gallery-expand-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLightboxOpen(true)
                }}
                title="Open full size image"
              >
                <Maximize2 size={16} />
              </button>
            </>
          ) : (
            <div className="gallery-placeholder">
              <span>Image coming soon</span>
            </div>
          )}

          {/* Badges */}
          <div className="gallery-badges">
            {isBestseller && <span className="gallery-badge bestseller">BESTSELLER</span>}
            {discountPercentage && discountPercentage > 0 && (
              <span className="gallery-badge discount">-{discountPercentage}% OFF</span>
            )}
          </div>

          {/* Navigation Arrows for multi-images */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                className="gallery-arrow-btn prev"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="gallery-arrow-btn next"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Pagination Dots */}
        {hasMultipleImages && (
          <div className="gallery-mobile-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`gallery-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="gallery-lightbox" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={24} />
            </button>
            <img src={src(activeImage)} alt={title} className="lightbox-img" />
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  className="lightbox-arrow prev"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  className="lightbox-arrow next"
                  onClick={handleNext}
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
