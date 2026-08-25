import { FaInstagram } from 'react-icons/fa'

const instaPosts = [
  {
    id: 1,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    alt: 'Typing on laptop wearing gold rings',
    link: 'https://instagram.com/sugrajewels',
  },
  {
    id: 2,
    type: 'reel',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80',
    alt: 'The Stack 6 Ways to Wear It',
    caption: 'The Stack.',
    subcaption: '6 Ways to Wear It.',
    link: 'https://instagram.com/sugrajewels',
  },
  {
    id: 3,
    type: 'brand',
    title: 'Sugra',
    subtitle: 'JEWELS',
    link: 'https://instagram.com/sugrajewels',
  },
  {
    id: 4,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80',
    alt: 'The Stack 6 Ways to Wear It',
    link: 'https://instagram.com/sugrajewels',
  },
  {
    id: 5,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    alt: 'Necklace collection',
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

        {/* HORIZONTAL SCROLL GRID */}
        <div className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[220px] md:auto-cols-[250px] gap-3 sm:gap-4 overflow-x-auto scrollbar-none items-stretch">
          {instaPosts.map((post) => {
            // TILE TYPE 3: BRAND TILE
            if (post.type === 'brand') {
              return (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex aspect-[4/5] max-h-[340px] items-center justify-center rounded-lg bg-[#fdfbf7] border border-[#f0e8dc] shadow-xs p-2 sm:p-6 transition-transform hover:-translate-y-1 text-center"
                >
                  <div>
                    <h3 className="font-serif text-[20px] sm:text-[38px] tracking-tight font-normal text-[#1a1613]">
                      {post.title}
                    </h3>
                    <p className="font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#b58a4c] mt-0.5">
                      {post.subtitle}
                    </p>
                  </div>
                </a>
              )
            }

            // TILE TYPE 2: REEL TILE (with caption)
            if (post.type === 'reel') {
              return (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-[4/5] max-h-[340px] overflow-hidden rounded-lg bg-[#111] shadow-xs"
                >
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-lg bg-black/50 text-white backdrop-blur-xs border border-white/20 transition-transform group-hover:scale-115">
                      <FaInstagram className="text-base sm:text-xl" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 text-left text-white">
                    <p className="font-serif text-[12px] sm:text-[18px] leading-tight">{post.caption}</p>
                    <p className="font-sans text-[9px] sm:text-[12px] text-white/80 font-normal hidden sm:block">{post.subcaption}</p>
                  </div>
                </a>
              )
            }

            // TILE TYPE 1: STANDARD IMAGE TILE
            return (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[4/5] max-h-[340px] overflow-hidden rounded-lg bg-[#f6f2ec] shadow-xs"
              >
                <img
                  src={post.image}
                  alt={post.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <FaInstagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}