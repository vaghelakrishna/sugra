import { useState, useRef, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'

export const categories = [
  { name: 'Rings', links: ['All Rings', 'Adjustable Rings', 'Crystal Rings', 'Statement Rings'], image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80' },
  { name: 'Earrings', links: ['All Earrings', 'Stud Earrings', 'Hoop Earrings', 'Statement Earrings'], image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80' },
  { name: 'Necklaces', links: ['All Necklaces', 'Chains', 'Pendants', 'Layered Necklaces'], image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80' },
  { name: 'Bracelets', links: ['All Bracelets', 'Cuffs', 'Chains', 'Charm Bracelets'], image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Watches', links: ['All Watches', 'Classic Watches', 'Minimal Watches', 'Gift Watches'], image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Mystery Jar', links: ['Discover the Jar', 'Gold Surprises', 'Everyday Favourites', 'Gift a Jar'], image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80' },
  { name: 'Mystery Scoop', links: ['Discover the Scoop', 'Lucky Dip', 'Best Value', 'Gift a Scoop'], image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80' },
]

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Rings')
  const headerRef = useRef<HTMLElement>(null)

  const closeMenu = () => { setMenuOpen(false); setMegaOpen(false) }
  const selectedCategory = categories.find(category => category.name === activeCategory) || categories[0]
  // For desktop hover/focus
  const openMegaMenu = (category: string) => { setActiveCategory(category); setMegaOpen(true) }

  // For mobile accordion click
  const handleCategoryClick = (categoryName: string) => {
    // If the clicked category is already open, close it. Otherwise, open it.
    const isOpening = activeCategory !== categoryName || !megaOpen
    setActiveCategory(categoryName)
    setMegaOpen(isOpening)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <header ref={headerRef} onMouseLeave={() => setMegaOpen(false)} className="relative z-20 border-t-4 border-[#2f2925] bg-white">
      <div className="relative mx-auto flex h-19 max-w-375 flex-wrap items-center justify-between gap-x-6 px-5 sm:h-23.5 sm:flex-nowrap sm:gap-8 sm:px-[3.2vw]">
        <button className="flex items-center justify-center border-0 bg-transparent p-1 text-[#292929] sm:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} strokeWidth={1.7} /> : <Menu size={22} strokeWidth={1.7} />}</button>
        <Link className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0" to="/" aria-label="SUGRA home"><img className="h-9 w-40 object-contain sm:h-12 sm:w-52" src="/sugra-logo.svg" alt="SUGRA" /></Link>
        <form className="order-last hidden h-13 w-full items-center rounded-full border border-[#e6e6e6] bg-[#fafafa] px-5 sm:order-none sm:flex sm:h-15 sm:max-w-md sm:flex-1 sm:px-7" role="search"><input className="w-full border-0 bg-transparent font-sans text-[16px] text-[#333] outline-none placeholder:text-[#858585] sm:text-[17px]" aria-label="Search jewellery" placeholder="Search jewellery..." /><button className="border-0 bg-transparent p-0 text-[#222]" aria-label="Submit search"><Search size={22} strokeWidth={1.5} /></button></form>
        <div className="flex items-center justify-self-end gap-4 text-[#292929] sm:gap-6"><Link className="transition-colors hover:text-[#875c35]" to="/login" aria-label="Log in" title="Log in"><UserRound size={21} strokeWidth={1.6} /></Link><Link className="transition-colors hover:text-[#875c35]" to="/wishlist" aria-label="Wishlist" title="Wishlist"><Heart size={21} strokeWidth={1.6} /></Link><Link className="relative transition-colors hover:text-[#875c35]" to="/cart" aria-label="Shopping bag" title="Shopping bag"><ShoppingBag size={21} strokeWidth={1.6} /><sup className="absolute -right-3 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#171717] pt-px font-sans text-[10px] font-normal text-white">1</sup></Link></div>
      </div>
      <nav className={`relative mx-auto max-w-375 justify-center border-t border-b border-[#ddd] bg-white px-5 text-[15px] text-[#292929] sm:flex sm:gap-8 sm:px-4 sm:text-[16px] lg:gap-13.25 ${menuOpen ? 'flex! flex-col items-stretch py-3 sm:py-0' : 'hidden! sm:flex!'}`} onFocus={() => setMegaOpen(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMegaOpen(false) }}>
        {categories.map(category => (
          <Fragment key={category.name}>
            <button
              className={`relative flex h-12 items-center justify-between border-b border-[#ececec] bg-transparent text-left transition-colors hover:text-[#875c35] sm:h-16.75 sm:border-0 sm:text-center ${activeCategory === category.name && megaOpen ? 'text-[#875c35] sm:text-[#292929] sm:after:absolute sm:after:bottom-3.5 sm:after:left-0 sm:after:right-0 sm:after:h-0.5 sm:after:bg-[#252525]' : ''}`}
              aria-expanded={activeCategory === category.name && megaOpen}
              onMouseEnter={() => openMegaMenu(category.name)} // Desktop hover
              onFocus={() => openMegaMenu(category.name)}     // Desktop keyboard focus
              onClick={() => handleCategoryClick(category.name)} // Universal click handler
            >
              {category.name}
              <span className="text-lg sm:hidden">{activeCategory === category.name && megaOpen ? '−' : '+'}</span>
            </button>
            {/* Mobile Accordion Panel */}
            <div className={`overflow-hidden bg-white sm:hidden ${activeCategory === category.name && megaOpen ? 'block' : 'hidden'}`}>
              <div className="p-6">
                {category.links.map(link => <Link className="mb-4.75 block font-sans text-[16px] text-[#353535] transition-colors hover:text-[#875c35]" to={`/collections?category=${category.name.toLowerCase()}&style=${link.toLowerCase().replaceAll(' ', '-')}`} onClick={closeMenu} key={link}>{link}</Link>)}
              </div>
            </div>
          </Fragment>
        ))}
        {/* Desktop Mega Menu */}
        <div className={`${megaOpen ? 'grid' : 'hidden'} absolute left-1/2 top-full z-30 w-screen -translate-x-1/2 grid-cols-[minmax(280px,1fr)_minmax(210px,266px)_minmax(210px,266px)] gap-8 bg-white px-[7vw] pb-22 pt-13.25 shadow-[0_14px_25px_rgba(0,0,0,0.05)] sm:max-lg:px-10 max-sm:hidden`}>
          <div>
            <p className="mb-5 text-[20px] font-bold uppercase tracking-[0.02em] sm:text-[25px]">{selectedCategory.name}</p>
            {selectedCategory.links.map(link => <Link className="mb-3 block font-sans text-[16px] text-[#353535] transition-colors hover:text-[#875c35] sm:mb-4.75 sm:text-[18px]" to={`/collections?category=${selectedCategory.name.toLowerCase()}&style=${link.toLowerCase().replaceAll(' ', '-')}`} onClick={closeMenu} key={link}>{link}</Link>)}</div>
          <Link className="group flex flex-col gap-3" to={`/collections?category=${selectedCategory.name.toLowerCase()}&sort=new`} onClick={closeMenu}><img className="h-55 w-full rounded-xl object-cover transition-transform group-hover:scale-[1.02] sm:h-80" src={selectedCategory.image} alt={`New ${selectedCategory.name.toLowerCase()} collection`} /><span className="text-center font-sans text-[15px] text-[#333] sm:text-[18px]">New Collection</span></Link><Link className="group flex flex-col gap-3" to={`/collections?category=${selectedCategory.name.toLowerCase()}&sort=popular`} onClick={closeMenu}><img className="h-55 w-full rounded-xl object-cover transition-transform group-hover:scale-[1.02] sm:h-80" src={selectedCategory.image} alt={`Best selling ${selectedCategory.name.toLowerCase()}`} /><span className="text-center font-sans text-[15px] text-[#333] sm:text-[18px]">Best Sellers</span></Link></div>
      </nav>
    </header>
  );
}
