import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
} from 'react-icons/fa6'
import { Sparkles, Gem, ShieldCheck } from 'lucide-react'

export default function StoreFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer id="footer" className="w-full bg-white font-sans text-[#222]">
      {/* =========================================================================
          1. TOP PROMISE BANNER (White / Soft Light Background)
          ========================================================================= */}
      <section className="border-t border-[#eae5e0] bg-[#faf8f5] px-6 py-14 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-10 text-[11px] font-bold uppercase tracking-[0.25em] text-[#875c35] sm:mb-14 sm:text-[12px]">
            SUGRA PROMISE YOU
          </p>

          <div className="flex flex-row items-center text-center gap-20 flex-wrap">
            {/* Promise Item 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#875c35] shadow-sm">
                <Sparkles size={26} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-serif text-[14px] font-bold uppercase tracking-[0.14em] text-[#222] sm:text-[15px]">
                HYPOALLERGENIC COMFORT
              </h3>
              <p className="max-w-xs text-[12px] leading-relaxed text-[#736962] sm:text-[13px]">
                Made for sensitive skin, our hypoallergenic pieces feel as good as they look.
                No irritation, just all-day comfort.
              </p>
            </div>

            {/* Promise Item 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#875c35] shadow-sm">
                <Gem size={26} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-serif text-[14px] font-bold uppercase tracking-[0.14em] text-[#222] sm:text-[15px]">
                LUXURIOUS 18K GOLD PLATING
              </h3>
              <p className="max-w-xs text-[12px] leading-relaxed text-[#736962] sm:text-[13px]">
                Made with radiant 18K gold plating to lift your everyday style. Whether it's a special
                occasion or a daily pick-me-up, shine bright, always.
              </p>
            </div>

            {/* Promise Item 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#875c35] shadow-sm">
                <ShieldCheck size={26} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-serif text-[14px] font-bold uppercase tracking-[0.14em] text-[#222] sm:text-[15px]">
                ANTI-TARNISH FINISH
              </h3>
              <p className="max-w-xs text-[12px] leading-relaxed text-[#736962] sm:text-[13px]">
                Stay golden. Our anti-tarnish coating keeps your jewelry looking fresh, wear
                after wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN BLACK FOOTER (4 Columns on Laptop & Desktop)
          ========================================================================= */}
      <section className="bg-black px-6 py-14 text-[#a3a3a3] sm:px-10 lg:px-16 sm:py-18">
        <div className="mx-auto max-w-360">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8 lg:gap-12 grid-flow-col">
            {/* Column 1: Support */}
            <div>
              <h4 className="mb-6 text-[12px] font-bold uppercase tracking-[0.18em] text-white">
                SUPPORT
              </h4>
              <ul className="space-y-3 text-[12px] uppercase tracking-wider text-[#999]">
                <li>
                  <Link to="/faq" className="transition-colors hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/buy-back-policy" className="transition-colors hover:text-white">
                    BUY BACK POLICY
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="transition-colors hover:text-white">
                    SHIPPING INFORMATION
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="transition-colors hover:text-white">
                    PRIVACY POLICY
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="transition-colors hover:text-white">
                    RETURN AND REFUND
                  </Link>
                </li>
                <li>
                  <Link to="/cancellations" className="transition-colors hover:text-white">
                    CANCELLATIONS
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-colors hover:text-white">
                    TERMS & CONDITIONS
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="mb-6 text-[12px] font-bold uppercase tracking-[0.18em] text-white">
                QUICK LINKS
              </h4>
              <ul className="space-y-3 text-[12px] uppercase tracking-wider text-[#999]">
                <li>
                  <Link to="/about" className="transition-colors hover:text-white">
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="transition-colors hover:text-white">
                    BLOGS
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition-colors hover:text-white">
                    CONTACT US
                  </Link>
                </li>
                <li>
                  <Link to="/collections/all" className="transition-colors hover:text-white">
                    SHOP ALL
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="transition-colors hover:text-white">
                    SITEMAP
                  </Link>
                </li>
                <li>
                  <Link to="/bulk-order" className="transition-colors hover:text-white">
                    BULK ORDER
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="transition-colors hover:text-white">
                    TRACK YOUR ORDER
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="transition-colors hover:text-white">
                    RESOURCE PAGE
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Newsletter */}
            <div>
              <h4 className="mb-6 text-[12px] font-bold uppercase tracking-[0.18em] text-white">
                NEWSLETTER
              </h4>
              <p className="mb-5 text-[13px] leading-relaxed text-[#999]">
                Sign up to get our latest updates &amp; offers.
              </p>
              <form onSubmit={subscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="h-11 w-full border border-[#333] bg-[#0d0d0d] px-4 text-[13px] text-white outline-none placeholder:text-[#666] focus:border-[#666]"
                />
                <button
                  type="submit"
                  className="h-11 w-full border border-[#444] bg-transparent text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
                >
                  {subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
                </button>
              </form>
            </div>

            {/* Column 4: Contact Us */}
            <div>
              <h4 className="mb-6 text-[12px] font-bold uppercase tracking-[0.18em] text-white">
                CONTACT US
              </h4>
              <p className="mb-2 text-[13px] font-bold text-white">We're here to help!</p>
              <div className="space-y-1 text-[12px] leading-relaxed text-[#999]">
                <p>
                  Contact us at{' '}
                  <a
                    href="mailto:care@sugrajewels.com"
                    className="text-white underline underline-offset-2"
                  >
                    care@sugrajewels.com
                  </a>
                </p>
                <p>
                  Call / WhatsApp:{' '}
                  <a
                    href="tel:+919059396361"
                    className="text-white underline underline-offset-2"
                  >
                    +91 90593 96361
                  </a>
                </p>
                <p className="text-[#777]">(10 AM - 6 PM, Mon-Sat)</p>
              </div>
            </div>
          </div>

          {/* Social Icons & Copyright Row */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-[#1f1f1f] pt-8 sm:flex-row">
            <div className="flex items-center gap-5 text-[15px] text-[#999]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Pinterest"
              >
                <FaPinterestP />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>

            <p className="text-[11px] uppercase tracking-widest text-[#777]">
              &copy; {new Date().getFullYear()}, SUGRA JEWELS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. POPULAR SEARCHES SEO KEYWORDS (White Background Strip)
          ========================================================================= */}
      <section className="border-t border-[#e8e4df] bg-white px-6 py-10 text-[#444] sm:px-10 lg:px-16 sm:py-14">
        <div className="mx-auto max-w-[1440px]">
          <h4 className="mb-6 text-[14px] font-bold text-[#1a1a1a]">Popular Searches</h4>

          <div className="space-y-4 text-[12px] leading-relaxed text-[#666]">
            {/* Earrings */}
            <div>
              <span className="font-semibold text-[#222]">Earrings: </span>
              {[
                'Gold Earrings',
                'Diamond Earrings',
                'Silver Earrings',
                'Hoop Earrings',
                'Stud Earrings',
                'Pearl Earrings',
                'Fancy Earrings',
                'Stone Earrings',
                'Daily Wear Earrings',
                'Dangler Earrings',
              ].map((term, i, arr) => (
                <span key={term}>
                  <Link
                    to={`/collections/all?search=${encodeURIComponent(term)}`}
                    className="hover:text-[#875c35] hover:underline"
                  >
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span className="mx-2 text-[#ccc]">|</span>}
                </span>
              ))}
            </div>

            {/* For Women */}
            <div>
              <span className="font-semibold text-[#222]">For Women: </span>
              {[
                'Rings For Women',
                'Earrings For Women',
                'Bracelets For Women',
                'Pendants For Women',
                'Necklaces For Women',
                'Bangles For Women',
              ].map((term, i, arr) => (
                <span key={term}>
                  <Link
                    to={`/collections/all?search=${encodeURIComponent(term)}`}
                    className="hover:text-[#875c35] hover:underline"
                  >
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span className="mx-2 text-[#ccc]">|</span>}
                </span>
              ))}
            </div>

            {/* Bracelets */}
            <div>
              <span className="font-semibold text-[#222]">Bracelets: </span>
              {[
                'Gold Plated Bracelet',
                'Gold Bracelets',
                'Diamond Bracelets',
                'Pearl Bracelets',
                'Evil Eye Bracelets',
                'Chain Bracelets',
                'Stone Bracelets',
                'Cuff Bracelets',
              ].map((term, i, arr) => (
                <span key={term}>
                  <Link
                    to={`/collections/all?search=${encodeURIComponent(term)}`}
                    className="hover:text-[#875c35] hover:underline"
                  >
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span className="mx-2 text-[#ccc]">|</span>}
                </span>
              ))}
            </div>

            {/* Necklace */}
            <div>
              <span className="font-semibold text-[#222]">Necklace: </span>
              {[
                'Gold Necklace',
                'Pendant Necklace',
                'Ruby Necklace',
                'Choker Necklace',
                'Pearl Necklace',
                'Chain Necklace',
                'Stone Necklace',
                'Initial Necklace',
                'Letter Necklace',
                'Fancy Necklace',
                '18k Gold Chains',
              ].map((term, i, arr) => (
                <span key={term}>
                  <Link
                    to={`/collections/all?search=${encodeURIComponent(term)}`}
                    className="hover:text-[#875c35] hover:underline"
                  >
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span className="mx-2 text-[#ccc]">|</span>}
                </span>
              ))}
            </div>

            {/* Rings */}
            <div>
              <span className="font-semibold text-[#222]">Rings: </span>
              {[
                'Gold Plated Rings',
                'Silver Plated Rings',
                'Band Ring',
                'Engagement Ring',
                'Couple Ring',
                'Wedding Ring',
                'Vanki Ring',
                'Cocktail Ring',
                'Love Ring',
                'Infinity Rings',
                'Promise Ring',
                'Solis Ring',
              ].map((term, i, arr) => (
                <span key={term}>
                  <Link
                    to={`/collections/all?search=${encodeURIComponent(term)}`}
                    className="hover:text-[#875c35] hover:underline"
                  >
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span className="mx-2 text-[#ccc]">|</span>}
                </span>
              ))}
            </div>

            {/* Jewellery */}
            <div>
              <span className="font-semibold text-[#222]">Jewellery: </span>
              {[
                'Contemporary Jewellery',
                'Gold Plated Jewellery',
                'Party Wear Jewellery',
                'Party Wear Necklace',
                'Pearl Jewellery',
                'Daily Wear Jewellery',
                'Traditional Jewellery',
                'Online Jewellery',
                'Sugra Jewellery',
                'Sugra Earrings',
                'Sugra Necklace',
                'Sugra Collection',
                'Silver Plated Jewellery',
                'Semi Fine Jewellery',
              ].map((term, i, arr) => (
                <span key={term}>
                  <Link
                    to={`/collections/all?search=${encodeURIComponent(term)}`}
                    className="hover:text-[#875c35] hover:underline"
                  >
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span className="mx-2 text-[#ccc]">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        className="fixed bottom-6 right-6 z-50 grid h-13 w-13 place-items-center rounded-full bg-[#20d366] text-white shadow-xl transition-transform hover:scale-110"
        href="https://wa.me/919059396361"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </footer>
  )
}
