import { Link } from 'react-router-dom'

const categoryCards = [
  {
    name: 'BRACELETS',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'EARRINGS',
    slug: 'earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'NECKLACES',
    slug: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'RINGS',
    slug: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'WATCHES',
    slug: 'watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
  },
]

export default function ShopByCategories() {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.25em] text-[#222] mb-4 sm:mb-6">
          SHOP BY CATEGORIES
        </h2>

        {/* ALWAYS HORIZONTAL SCROLL GRID */}
        <div className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[220px] md:auto-cols-[260px] gap-3 sm:gap-4 overflow-x-auto scrollbar-none">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              to={`/collections/all?category=${cat.slug}`}
              className="group relative block aspect-[4/5] max-h-[300px] sm:max-h-[340px] w-full overflow-hidden bg-[#e8e2da] rounded-xs"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <h3 className="font-serif text-[18px] sm:text-[22px] font-normal tracking-wide text-white uppercase">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}