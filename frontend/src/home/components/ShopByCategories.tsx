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
]

export default function ShopByCategories() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[16px] sm:text-[20px] font-bold uppercase tracking-[0.25em] text-[#1c1815] mb-8 sm:mb-12">
          SHOP BY CATEGORIES
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              to={`/collections/all?category=${cat.slug}`}
              className="group relative block aspect-square sm:aspect-4/5 overflow-hidden bg-[#e8e2da]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6">
                <h3 className="font-serif text-[18px] sm:text-[26px] font-normal tracking-wide text-white uppercase drop-shadow-sm">
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
