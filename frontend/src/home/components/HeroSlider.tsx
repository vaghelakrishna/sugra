import { useEffect, useState } from 'react'
import { slides } from '../data'

export default function HeroSlider() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      6000
    )
    return () => window.clearInterval(timer)
  }, [])

  const active = slides[slide] as { eyebrow?: string; title?: string; copy?: string; image: string; link?: string }

  return (
    <div
      className="relative flex flex-col justify-end min-h-[85vh] sm:min-h-[90vh] w-full bg-cover bg-center transition-all duration-700 ease-in-out px-4 sm:px-12 pb-8 sm:pb-12 overflow-hidden"
      style={{ backgroundImage: `url(${active.image})` }}
    >
      {/* Clickable Overlay Link */}
      <a
        href={active.link || "#collections"}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={active.title || "Slide link"}
      />

      {/* Minimal Bottom Controls */}
      <div className="relative z-10 flex items-center justify-between pt-4 sm:pt-6 text-white pointer-events-auto">
        {/* Left Subtitle or Brand text (Optional) */}
        <div className="text-xs uppercase tracking-[0.2em] text-white/70">
          Sugra Jewels
        </div>

        {/* Center Minimal Line Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-0.5 transition-all duration-500 cursor-pointer z-20 ${index === slide ? 'w-8 sm:w-10 bg-white' : 'w-3 sm:w-5 bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setSlide(index)}
            />
          ))}
        </div>

        {/* Right Minimal Next Button */}
        <button
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/20 hover:bg-black/40 backdrop-blur-xs text-white transition-all cursor-pointer z-20"
          aria-label="Next slide"
          onClick={() => setSlide((slide + 1) % slides.length)}
        >
          <span className="text-lg leading-none">→</span>
        </button>
      </div>
    </div>
  )
}