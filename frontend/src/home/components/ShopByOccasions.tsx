import { Link } from 'react-router-dom'

const occasionItems = [
  {
    name: 'FESTIVE',
    slug: 'festive',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85',
    link: '/collections/all?occasion=festive',
  },
  {
    name: 'PARTY WEAR',
    slug: 'party-wear',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85',
    link: '/collections/all?occasion=party',
  },
  {
    name: 'VACATION',
    slug: 'vacation',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85',
    link: '/collections/all?occasion=vacation',
  },
  {
    name: 'OFFICE WEAR',
    slug: 'office-wear',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85',
    link: '/collections/all?occasion=office',
  },
  {
    name: 'GIFTING',
    scriptSubtitle: 'with love',
    slug: 'gifting',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85',
    link: '/collections/all?occasion=gifting',
  },
]

export default function ShopByOccasions() {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.25em] text-[#222] mb-4 sm:mb-6">
          SHOP BY OCCASIONS
        </h2>

        {/* COMPACT SLEEK GRID WITH GRID-AUTO-FLOW: COLUMN */}
        <div
          className="grid grid-flow-col auto-cols-[165px] sm:auto-cols-[200px] lg:grid-cols-5 lg:auto-cols-auto gap-3 sm:gap-4 overflow-x-auto scrollbar-none"
          style={{ gridAutoFlow: 'column' }}
        >
          {occasionItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="group relative block aspect-[4/5] max-h-[260px] sm:max-h-[300px] w-full overflow-hidden bg-[#221c18] rounded-xs shadow-xs"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <h3 className="font-serif text-[16px] sm:text-[20px] font-normal tracking-wide text-white uppercase">
                  {item.name}
                  {item.scriptSubtitle && (
                    <span className="block font-serif lowercase italic text-[13px] sm:text-[15px] text-[#e8ded2] -mt-1">
                      {item.scriptSubtitle}
                    </span>
                  )}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
