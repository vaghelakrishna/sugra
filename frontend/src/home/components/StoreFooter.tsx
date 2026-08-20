import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowUp, FaCcAmex, FaCcDinersClub, FaCcDiscover, FaCcMastercard, FaCcPaypal, FaCcVisa, FaWhatsapp } from 'react-icons/fa6'

export default function StoreFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return <footer id="footer" className="relative bg-[#111] px-6 pb-7 pt-14 text-[#aeb3c1] sm:px-[3.6vw] sm:pt-20">
    <div className="mx-auto max-w-[1800px]">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.05fr_1.15fr_1.35fr] lg:gap-10">
        <FooterColumn title="Support"><a href="#shipping">Shipping Information</a><a href="#privacy">Privacy Policy</a><a href="#returns">Return and Refund</a><a href="#terms">Terms & Conditions</a></FooterColumn>
        <FooterColumn title="Quick Links"><Link to="/collections/all">All Jewellery</Link><Link to="/collections/all?category=mystery-scoop">Mystery Scoop</Link><Link to="/collections/all?category=mystery-jar">Mystery Jar</Link><Link to="/collections/all?category=rings">Rings</Link><Link to="/collections/all?category=earrings">Earrings</Link><Link to="/collections/all?category=necklaces">Necklaces</Link><Link to="/collections/all?category=bracelets">Bracelets</Link><Link to="/collections/all?category=watches">Watches</Link></FooterColumn>
        <FooterColumn title="Men's Accessories"><a href="#collections">Brooches</a><a href="#collections">Bracelets</a><a href="#collections">Chains</a><a href="#collections">Kada</a></FooterColumn>
        <section><h3 className="mb-7 text-[16px] font-bold uppercase tracking-[0.12em] text-white sm:text-[17px]">Newsletter</h3><p className="mb-6 max-w-70 text-[19px] leading-tight text-[#aeb3c1]">Sign Up to get our latest<br className="hidden sm:block" /> updates &amp; offers.</p><form className="max-w-[320px]" onSubmit={subscribe}><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" required value={email} onChange={event => { setEmail(event.target.value); setSubscribed(false) }} placeholder="E-mail" className="h-14.75 w-full border border-[#444] bg-transparent px-5 text-[16px] text-white outline-none placeholder:text-[#aeb3c1] focus:border-white" /><button className="mt-4 h-14.75 w-full rounded-full border border-[#555] bg-transparent text-[14px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[#111]" type="submit">{subscribed ? 'Subscribed' : 'Subscribe'}</button></form></section>
        <section><h3 className="mb-7 text-[16px] font-bold uppercase tracking-[0.12em] text-white sm:text-[17px]">Contact Us</h3><p className="mb-4 font-bold text-white">We're here to help!</p><p className="mb-4">Contact us at <a className="text-white underline underline-offset-2" href="mailto:hello@sugrajewels.com">hello@sugrajewels.com</a></p><p className="mb-4">Call / WhatsApp <a className="text-white underline underline-offset-2" href="tel:+919059396361">+91 90593 96361</a></p><p>Mumbai, Maharashtra, India</p></section>
      </div>
      <div className="mt-16 flex flex-col gap-7 border-t border-[#303030] pt-7 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px]">© 2026 sugrajewels <span className="text-white">© Crafted by krishna vaghela</span></p>
        <div className="flex flex-wrap items-center gap-2 text-[30px] leading-none"><FaCcVisa className="rounded bg-[#143bd1] text-white" title="Visa" /><FaCcMastercard className="rounded bg-[#eee] text-[#e62e2e]" title="Mastercard" /><FaCcAmex className="rounded bg-white text-[#2369a8]" title="American Express" /><FaCcPaypal className="rounded bg-white text-[#1264ad]" title="PayPal" /><FaCcDinersClub className="rounded bg-white text-[#1671b9]" title="Diners Club" /><FaCcDiscover className="rounded bg-white text-[#111]" title="Discover" /></div>
      </div>
    </div>
    <a className="fixed bottom-7 left-8 z-10 grid h-14 w-14 place-items-center rounded-full bg-white text-[#111] shadow-lg transition-transform hover:-translate-y-1" href="#top" aria-label="Back to top" title="Back to top"><FaArrowUp size={24} /></a>
    <a className="fixed bottom-7 right-8 z-10 grid h-14 w-14 place-items-center rounded-full bg-[#20d366] text-white shadow-lg transition-transform hover:-translate-y-1" href="https://wa.me/919059396361" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><FaWhatsapp size={29} /></a>
  </footer>
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="mb-7 text-[16px] font-bold uppercase tracking-[0.12em] text-white sm:text-[17px]">{title}</h3><div className="flex flex-col gap-4 text-[16px] leading-[1.35] [&_a]:transition-colors [&_a:hover]:text-white">{children}</div></section>
}
