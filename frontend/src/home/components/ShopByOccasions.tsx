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
    <section className="bg-white py-14 sm:py-20 border-t border-[#f0eae2]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
        <h2 className="text-center font-sans text-[16px] sm:text-[20px] font-bold uppercase tracking-[0.25em] text-[#1c1815] mb-8 sm:mb-12">
          SHOP BY OCCASIONS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {occasionItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="group relative block aspect-3/4 sm:aspect-4/5 overflow-hidden bg-[#221c18] shadow-xs"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 right-4 sm:right-5">
                <h3 className="font-serif text-[17px] sm:text-[21px] font-normal tracking-wide text-white uppercase drop-shadow-sm">
                  {item.name}
                  {item.scriptSubtitle && (
                    <span className="block font-serif lowercase italic text-[14px] sm:text-[16px] text-[#e8ded2] -mt-1">
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
