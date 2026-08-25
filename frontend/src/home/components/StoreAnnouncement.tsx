import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const announcements = [
  'FLAT 50% OFF ON ORDER ABOVE ₹ 20,000',
  'FREE EXPRESS SHIPPING ACROSS INDIA • CODE: WELCOME10',
  '18K GOLD PLATED • 100% WATERPROOF JEWELRY',
]

export default function StoreAnnouncement() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((curr) => (curr + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setIndex((curr) => (curr === 0 ? announcements.length - 1 : curr - 1))
  const next = () => setIndex((curr) => (curr + 1) % announcements.length)

  return (
    <aside aria-label="Store Announcement" className="bg-black text-white py-2 px-4 transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-white">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous announcement"
          className="text-white/70 hover:text-white p-1 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="text-center font-sans tracking-[0.2em] transition-opacity duration-300">
          {announcements[index]}
        </span>

        <button
          type="button"
          onClick={next}
          aria-label="Next announcement"
          className="text-white/70 hover:text-white p-1 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  )
}
