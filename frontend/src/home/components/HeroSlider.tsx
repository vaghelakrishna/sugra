import { useEffect, useState } from 'react'
import { slides } from '../data'

export default function HeroSlider() {
  const [slide, setSlide] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setSlide(current => (current + 1) % slides.length), 6000); return () => window.clearInterval(timer) }, [])
  const active = slides[slide]
  return <section className="hero" style={{ backgroundImage: `url(${active.image})` }}><div className="hero-overlay" /><div className="hero-copy"><p className="eyebrow">{active.eyebrow}</p><h1>{active.title}</h1><p>{active.copy}</p><a className="button button-light" href="#collections">Explore the collection <span>↗</span></a></div><div className="hero-controls"><span>{String(slide + 1).padStart(2, '0')} / 0{slides.length}</span><div className="slide-lines">{slides.map((item, index) => <button key={item.title} className={index === slide ? 'active' : ''} aria-label={`Show slide ${index + 1}`} onClick={() => setSlide(index)} />)}</div><button className="next-slide" aria-label="Next slide" onClick={() => setSlide((slide + 1) % slides.length)}>Next <span>→</span></button></div></section>
}
