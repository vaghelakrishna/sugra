// import { Instagram } from 'lucide-react'

const instaPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    alt: 'Typing on laptop wearing gold rings',
    link: 'https://instagram.com/sugrajewels',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80',
    alt: 'The Stack 6 Ways to Wear It',
    link: 'https://instagram.com/sugrajewels',
  },
  {
    id: 3,
    alt: 'SUGRA Brand Tile',
    link: 'https://instagram.com/sugrajewels',
  },
]

export default function InstagramGrid() {
  return (
    <section className="bg-white py-8 sm:py-12 border-t border-[#f0eae2]">
      <div className="mx-auto max-w-[1350px] px-3 sm:px-8">
        <h2 className="text-center font-sans text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.25em] text-[#222] mb-6 sm:mb-8">
          FOLLOW US ON INSTAGRAM
        </h2>

        {/* 3-COLUMN RESPONSIVE GRID ON MOBILE & DESKTOP */}
        <div className="grid grid-cols-3 gap-2 sm:gap-5 items-stretch">
          {/* TILE 1: LAPTOP TYPING WITH RINGS */}
          <a
            href={instaPosts[0].link}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-square sm:aspect-[4/5] max-h-[340px] overflow-hidden rounded-lg bg-[#f6f2ec] shadow-xs"
          >
            <img
              src={instaPosts[0].image}
              alt={instaPosts[0].alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              {/* <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" /> */}
            </div>
          </a>

          {/* TILE 2: REEL WITH INSTAGRAM ICON OVERLAY */}
          <a
            href={instaPosts[1].link}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-square sm:aspect-[4/5] max-h-[340px] overflow-hidden rounded-lg bg-[#111] shadow-xs"
          >
            <img
              src={instaPosts[1].image}
              alt={instaPosts[1].alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* INSTAGRAM CENTER ICON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-lg bg-black/50 text-white backdrop-blur-xs border border-white/20 transition-transform group-hover:scale-115">
                {/* <Instagram size={16} className="sm:hidden" />
                <Instagram size={20} className="hidden sm:block" /> */}
              </div>
            </div>

            {/* OVERLAY CAPTION */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 text-left text-white">
              <p className="font-serif text-[12px] sm:text-[18px] leading-tight">The Stack.</p>
              <p className="font-sans text-[9px] sm:text-[12px] text-white/80 font-normal hidden sm:block">6 Ways to Wear It.</p>
            </div>
          </a>

          {/* TILE 3: CREAM BRAND TILE */}
          <a
            href={instaPosts[2].link}
            target="_blank"
            rel="noreferrer"
            className="group relative flex aspect-square sm:aspect-[4/5] max-h-[340px] items-center justify-center rounded-lg bg-[#fdfbf7] border border-[#f0e8dc] shadow-xs p-2 sm:p-6 transition-transform hover:-translate-y-1 text-center"
          >
            <div>
              <h3 className="font-serif text-[20px] sm:text-[38px] tracking-tight font-normal text-[#1a1613]">
                Sugra
              </h3>
              <p className="font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#b58a4c] mt-0.5">
                JEWELS
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
