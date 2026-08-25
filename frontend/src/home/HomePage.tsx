import StoreAnnouncement from './components/StoreAnnouncement'
import StoreHeader from './components/StoreHeader'
import HeroSlider from './components/HeroSlider'
import ShopByCategories from './components/ShopByCategories'
import WatchAndBuy from './components/WatchAndBuy'
import RakhiSection from './components/RakhiSection'
import NewArrivalsSection from './components/NewArrivalsSection'
import CategoryProductsSection from './components/CategoryProductsSection'
import ShopByOccasions from './components/ShopByOccasions'
import ShopTheLook from './components/ShopTheLook'
import WhatsappCommunity from './components/WhatsappCommunity'
import InstagramGrid from './components/InstagramGrid'
import FaqSection from './components/FaqSection'
import Newsletter from './components/Newsletter'
import StoreFooter from './components/StoreFooter'
import './home.css'

export default function HomePage() {
  return (
    <div className="storefront min-h-screen bg-white text-[#1c1815] font-sans antialiased">
      {/* TOP ANNOUNCEMENT BAR */}
      <StoreAnnouncement />

      {/* STICKY STORE HEADER */}
      <StoreHeader />

      <main className="overflow-x-hidden">
        {/* HERO SLIDER */}
        <HeroSlider />

        {/* SECTION 1: SHOP BY CATEGORIES */}
        <ShopByCategories />

        {/* SECTION 2: WATCH AND BUY */}
        <WatchAndBuy />

        {/* NEW SECTION: RAKHI GIFTS & CAMPAIGN (MATCHING SCREENSHOT) */}
        <RakhiSection />

        {/* NEW ARRIVALS PRODUCT GRID (WITH 2ND IMAGE HOVER SWAP) */}
        <NewArrivalsSection />

        {/* FEATURED CATEGORY 1: RINGS EDIT */}
        <CategoryProductsSection
          categorySlug="rings"
          title="Rings Collection"
          subtitle="STATEMENTS & STACKS"
        />

        {/* SECTION 3: SHOP BY OCCASIONS */}
        <ShopByOccasions />

        {/* FEATURED CATEGORY 2: NECKLACES EDIT */}
        <CategoryProductsSection
          categorySlug="necklaces"
          title="Necklaces Edit"
          subtitle="EVERYDAY ELEGANCE"
        />

        {/* SECTION 4: SHOP THE LOOK */}
        <ShopTheLook />

        {/* SECTION 5: JOIN OUR WHATSAPP COMMUNITY */}
        <WhatsappCommunity />

        {/* FOLLOW US ON INSTAGRAM */}
        <InstagramGrid />

        {/* FAQ ACCORDION */}
        <FaqSection />

        {/* VIP NEWSLETTER */}
        <Newsletter />
      </main>

      {/* LUXURY STORE FOOTER */}
      <StoreFooter />
    </div>
  )
}
