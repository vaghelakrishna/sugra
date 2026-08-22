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
      { x: 38, y: 52, title: 'Zovia Bold Link Chain Ring', index: 0 },
      { x: 50, y: 55, title: 'Twisted Wave Gold Band', index: 1 },
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
      { x: 48, y: 46, title: 'Sunburst Locket Necklace', index: 0 },
      { x: 52, y: 62, title: 'Layered Snake Chain', index: 1 },
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
    <section className="bg-white py-14 sm:py-20 border-t border-[#f0eae2] relative">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[16px] sm:text-[20px] font-bold uppercase tracking-[0.25em] text-[#1c1815] mb-8 sm:mb-12">
          SHOP THE LOOK
        </h2>

        <div className="relative flex items-center">
          {/* LEFT CAROUSEL ARROW */}
          <button
            type="button"
            onClick={prevLook}
            className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white shadow-lg text-[#222] transition-transform hover:scale-110 hover:bg-[#faf8f5]"
            aria-label="Previous look"
          >
            <ChevronLeft size={22} strokeWidth={1.75} />
          </button>

          {/* RIGHT CAROUSEL ARROW */}
          <button
            type="button"
            onClick={nextLook}
            className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white shadow-lg text-[#222] transition-transform hover:scale-110 hover:bg-[#faf8f5]"
            aria-label="Next look"
          >
            <ChevronRight size={22} strokeWidth={1.75} />
          </button>

          {/* SPLIT LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full max-w-5xl mx-auto">
            {/* LEFT: LIFESTYLE IMAGE WITH INTERACTIVE HOTSPOTS */}
            <div className="md:col-span-7 relative aspect-square overflow-hidden rounded-md bg-[#f6f2ec] shadow-sm">
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
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-10 cursor-pointer"
                    title={pin.title}
                    aria-label={pin.title}
                  >
                    {/* PULSATING RING */}
                    <span
                      className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-white/70 animate-ping'
                          : 'bg-white/30 group-hover/pin:scale-125'
                      }`}
                    />
                    {/* INNER WHITE DOT */}
                    <span
                      className={`relative block h-5 w-5 rounded-full border-2 border-white shadow-lg transition-transform ${
                        isActive ? 'bg-[#1c1815] scale-110' : 'bg-white/90 group-hover/pin:scale-110'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* RIGHT: CORRESPONDING PRODUCT CARD */}
            <div className="md:col-span-5 flex flex-col items-center text-center p-4">
              <div className="relative aspect-square w-48 sm:w-60 overflow-hidden rounded-md bg-[#f9f7f4] mb-5 shadow-xs">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <h3 className="font-sans text-[14px] sm:text-[15px] text-[#222] font-normal leading-snug max-w-xs mb-2">
                {currentProduct.title}
              </h3>

              <p className="font-sans text-[15px] sm:text-[16px] font-medium text-[#444] mb-6">
                {currentProduct.price}
              </p>

              <Link
                to={currentProduct.link}
                className="w-full max-w-xs rounded-none bg-[#1c1815] py-3.5 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#875c35]"
              >
                VIEW PRODUCT
              </Link>

              {/* PAGINATION DOTS */}
              <div className="flex items-center gap-2 mt-6">
                {currentLook.products.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProdIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === prodIdx ? 'w-5 bg-[#1c1815]' : 'w-2 bg-[#d1c8c0]'
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
