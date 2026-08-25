import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Eye, X, Play } from 'lucide-react'

type VideoItem = {
  id: number
  views: string
  title: string
  productThumb: string
  poster: string
  link: string
}

const reels: VideoItem[] = [
  {
    id: 1,
    views: '333',
    title: 'Lunessa Crystal Arc Necklace For Women',
    productThumb: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=necklaces',
  },
  {
    id: 2,
    views: '1K',
    title: 'Crystal Wrap Gold-plated Sculptural Ring',
    productThumb: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=rings',
  },
  {
    id: 3,
    views: '1K',
    title: 'Nysa Cascade Multi Gem Pendant Necklace For...',
    productThumb: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=necklaces',
  },
  {
    id: 4,
    views: '8',
    title: 'Pearl Twist Bracelet For Women',
    productThumb: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=bracelets',
  },
  {
    id: 5,
    views: '141',
    title: '18K Real Gold PVD Texture Reel',
    productThumb: 'https://images.unsplash.com/photo-1603561596112-db8d9b98b4e8?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1603561596112-db8d9b98b4e8?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all',
  },
  {
    id: 6,
    views: '9',
    title: 'Pearl Twist Bracelet For Women',
    productThumb: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=bracelets',
  },
  {
    id: 7,
    views: '1K',
    title: 'Noor Luxe Pearl Drop Earrings For Women',
    productThumb: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=earrings',
  },
  {
    id: 8,
    views: '5K',
    title: 'Diana Pearl Ear Cuff Earrings For Women',
    productThumb: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=earrings',
  },
  {
    id: 9,
    views: '258',
    title: 'Opaline Prism Choker',
    productThumb: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80',
    poster: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    link: '/collections/all?category=necklaces',
  },
]

export default function WatchAndBuy() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [activeReel, setActiveReel] = useState<VideoItem | null>(null)

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 260, behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.25em] text-[#222] mb-4 sm:mb-6">
          WATCH AND BUY
        </h2>

        <div className="relative">
          {/* RIGHT CAROUSEL ARROW BUTTON */}
          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 place-items-center rounded-full bg-white shadow-md text-[#222] transition-transform hover:scale-110"
            aria-label="Next items"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>

          {/* COMPACT REEL CAROUSEL */}
          <div
            ref={sliderRef}
            className="grid grid-flow-col auto-cols-[135px] sm:auto-cols-[165px] gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-none snap-x snap-mandatory"
            style={{ gridAutoFlow: 'column' }}
          >
            {reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveReel(reel)}
                className="group relative aspect-[9/15] max-h-[260px] sm:max-h-[300px] cursor-pointer overflow-hidden rounded-md bg-[#1a1512] snap-start shadow-xs transition-transform duration-300 hover:-translate-y-1"
              >
                {/* POSTER IMAGE */}
                <img
                  src={reel.poster}
                  alt={reel.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

                {/* VIEW BADGE (TOP LEFT) */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-sm bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-xs">
                  <Eye size={10} /> {reel.views}
                </div>

                {/* PRODUCT TAG SNIPPET (BOTTOM) */}
                <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center gap-1.5 rounded-sm bg-black/75 p-1 backdrop-blur-xs border border-white/10">
                  <img
                    src={reel.productThumb}
                    alt=""
                    className="h-7 w-7 rounded-xs object-cover border border-white/20 shrink-0"
                  />
                  <p className="font-sans text-[9px] leading-tight text-white line-clamp-2">
                    {reel.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REEL POPUP MODAL */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-full max-w-xs overflow-hidden rounded-xl bg-[#1c1815] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="absolute top-3 right-3 z-20 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white"
            >
              <X size={16} />
            </button>

            <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
              <img
                src={activeReel.poster}
                alt={activeReel.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 grid place-items-center bg-black/40 text-white text-center p-6">
                <Play size={36} fill="white" className="mb-2 opacity-90" />
                <p className="font-serif text-sm">{activeReel.title}</p>
                <Link
                  to={activeReel.link}
                  className="mt-3 inline-block rounded-xs bg-[#b58a4c] px-5 py-2 text-xs font-bold uppercase tracking-wider text-black"
                >
                  Shop Product →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
