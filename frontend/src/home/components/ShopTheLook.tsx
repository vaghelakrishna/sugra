import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type LookItem = {
  id: number
  modelImage: string
  pins: { x: number; y: number; title: string; index: number }[]
  products: {
    title: string
    price: string
    image: string
    link: string
  }[]
}

const looks: LookItem[] = [
  {
    id: 1,
    modelImage: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85',
    pins: [
      { x: 38, y: 52, title: 'Zovia Bold Link Chain Ring For Women', index: 0 },
      { x: 50, y: 55, title: 'Celeste Multi Gem Solitaire Band', index: 1 },
    ],
    products: [
      {
        title: 'Zovia Bold Link Chain Ring For Women',
        price: 'Rs 1,499.00',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
        link: '/collections/all?category=rings',
      },
      {
        title: 'Celeste Multi Gem Solitaire Band',
        price: 'Rs 1,899.00',
        image: 'https://images.unsplash.com/photo-1603561596112-db8d9b98b4e8?auto=format&fit=crop&w=600&q=80',
        link: '/collections/all?category=rings',
      },
    ],
  },
  {
    id: 2,
    modelImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    pins: [
      { x: 48, y: 46, title: 'Sunburst Locket 18K Gold Necklace', index: 0 },
      { x: 52, y: 62, title: 'Dainty Herringbone Chain Necklace', index: 1 },
    ],
    products: [
      {
        title: 'Sunburst Locket 18K Gold Necklace',
        price: 'Rs 1,999.00',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
        link: '/collections/all?category=necklaces',
      },
      {
        title: 'Dainty Herringbone Chain Necklace',
        price: 'Rs 1,299.00',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80',
        link: '/collections/all?category=necklaces',
      },
    ],
  },
]

export default function ShopTheLook() {
  const [lookIdx, setLookIdx] = useState(0)
  const [prodIdx, setProdIdx] = useState(0)

  const currentLook = looks[lookIdx]
  const currentProduct = currentLook.products[prodIdx] || currentLook.products[0]

  const prevLook = () => {
    setLookIdx((prev) => (prev === 0 ? looks.length - 1 : prev - 1))
    setProdIdx(0)
  }

  const nextLook = () => {
    setLookIdx((prev) => (prev === looks.length - 1 ? 0 : prev + 1))
    setProdIdx(0)
  }

  return (
    <section className="bg-white py-6 sm:py-8 relative">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.25em] text-[#222] mb-4 sm:mb-6">
          SHOP THE LOOK
        </h2>

        <div className="relative flex items-center">
          {/* LEFT CAROUSEL ARROW */}
          <button
            type="button"
            onClick={prevLook}
            className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white/90 shadow-md text-[#222] backdrop-blur-xs transition-transform hover:scale-110"
            aria-label="Previous look"
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>

          {/* RIGHT CAROUSEL ARROW */}
          <button
            type="button"
            onClick={nextLook}
            className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white/90 shadow-md text-[#222] backdrop-blur-xs transition-transform hover:scale-110"
            aria-label="Next look"
          >
            <ChevronRight size={20} strokeWidth={1.75} />
          </button>

          {/* RESPONSIVE LAYOUT: VERTICAL STACK ON MOBILE, 2-COLUMN GRID ON DESKTOP */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 items-center w-full max-w-4xl mx-auto px-4">
            {/* LIFESTYLE IMAGE WITH INTERACTIVE HOTSPOTS */}
            <div className="w-full md:col-span-7 relative aspect-square max-h-[340px] sm:max-h-[380px] overflow-hidden bg-[#f6f2ec] rounded-xs mx-auto">
              <img
                src={currentLook.modelImage}
                alt="Shop the look model"
                className="h-full w-full object-cover"
              />

              {/* HOTSPOT PIN DOTS */}
              {currentLook.pins.map((pin) => {
                const isActive = prodIdx === pin.index
                return (
                  <button
                    key={pin.title}
                    type="button"
                    onClick={() => setProdIdx(pin.index)}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer p-1"
                    title={pin.title}
                    aria-label={pin.title}
                  >
                    <span
                      className={`block h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-white shadow-md transition-transform ${
                        isActive ? 'bg-[#111] scale-110' : 'bg-white/90 hover:scale-110'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* PRODUCT DETAILS CARD */}
            <div className="w-full md:col-span-5 flex flex-col items-center text-center p-2 sm:p-4">
              <div className="relative aspect-square w-32 sm:w-44 overflow-hidden bg-[#f8f5f0] mb-3 shadow-xs rounded-xs">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="font-sans text-[12px] sm:text-[13px] text-[#222] font-normal leading-snug max-w-xs mb-1">
                {currentProduct.title}
              </h3>

              <p className="font-sans text-[12px] sm:text-[13px] font-normal text-[#666] mb-3">
                {currentProduct.price}
              </p>

              <Link
                to={currentProduct.link}
                className="w-full max-w-xs bg-[#111] py-2.5 px-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#875c35]"
              >
                VIEW PRODUCT
              </Link>

              {/* PAGINATION DOTS */}
              <div className="flex items-center gap-1.5 mt-3">
                {currentLook.products.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProdIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === prodIdx ? 'w-4 bg-[#111]' : 'w-1.5 bg-[#ccc]'
                    }`}
                    aria-label={`Product ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
