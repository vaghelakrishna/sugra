import { Link } from 'react-router-dom'

const occasions = [
  { name: 'Everyday', detail: 'Quiet pieces for daily rituals', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1100&q=85' },
  { name: 'Celebrations', detail: 'Make the moment luminous', image: 'https://images.unsplash.com/photo-1603561596112-db8d9b98b4e8?auto=format&fit=crop&w=1100&q=85' },
  { name: 'Gifting', detail: 'A little something unforgettable', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1100&q=85' },
  { name: 'Bridal', detail: 'For your most beautiful yes', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1100&q=85' },
]

export default function OccasionSection() {
  return <section className="px-[5.5vw] pb-24 pt-0 max-[700px]:px-[18px] max-[700px]:pb-20">
    <div className="mb-8 flex items-end justify-between gap-6 max-[700px]:flex-col max-[700px]:items-start">
      <div><p className="mb-4 text-[10px] font-bold tracking-[2.4px] text-[#b98550]">JEWELLERY FOR THE MOMENT</p><h2 className="m-0 font-serif text-[clamp(38px,5vw,66px)] leading-none text-[#2f2925]">Shop by occasion.</h2></div>
      <Link className="inline-flex gap-5 border-b border-[#ae7a45] pb-2 text-[10px] uppercase tracking-[1.4px] text-[#875c35]" to="/collections">Explore all <span className="text-base">↗</span></Link>
    </div>
    <div className="grid grid-cols-4 gap-3.5 max-[700px]:grid-cols-2 max-[700px]:gap-2.5">
      {occasions.map(occasion => <Link className="group relative block min-h-[420px] overflow-hidden bg-[#40342d] max-[700px]:min-h-70" to="/collections" key={occasion.name}>
        <img className="absolute inset-0 h-full min-h-[420px] w-full object-cover saturate-[.7] transition duration-700 group-hover:scale-105 group-hover:saturate-100 max-[700px]:min-h-[280px]" src={occasion.image} alt={occasion.name} />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#17110dcc] via-[#17110d20] to-transparent p-6 text-white max-[700px]:p-3.5">
          <span className="text-[10px] tracking-[1px] text-[#ead4bb] max-[700px]:text-[8px]">{occasion.detail}</span><h3 className="my-2.5 font-serif text-[31px] font-normal max-[700px]:mb-3 max-[700px]:mt-1.5 max-[700px]:text-[22px]">{occasion.name}</h3><b className="text-[10px] font-normal uppercase tracking-[1.3px]">Discover <i className="ml-3.5 text-base not-italic">↗</i></b>
        </div>
      </Link>)}
    </div>
  </section>
}
