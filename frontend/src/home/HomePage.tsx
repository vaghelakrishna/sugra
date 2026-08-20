import CollectionsSection from './components/CollectionsSection'
import FaqSection from './components/FaqSection'
import HeroSlider from './components/HeroSlider'
import Newsletter from './components/Newsletter'
import NewArrivalsSection from './components/NewArrivalsSection'
import OccasionSection from './components/OccasionSection'
import StoreFooter from './components/StoreFooter'
import StoreHeader from './components/StoreHeader'
import StorySection from './components/StorySection'
import './home.css'

export default function HomePage() {
  return <div className="storefront"><StoreHeader />
    <main>
      <HeroSlider />
      <StorySection />
      <CollectionsSection />
      <NewArrivalsSection />
      <OccasionSection />
      <FaqSection />
      <Newsletter />
    </main><StoreFooter />
  </div>
}
