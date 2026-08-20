import CollectionsSection from './components/CollectionsSection'
import FaqSection from './components/FaqSection'
import HeroSlider from './components/HeroSlider'
import Newsletter from './components/Newsletter'
import OccasionSection from './components/OccasionSection'
import StoreFooter from './components/StoreFooter'
import StoreHeader from './components/StoreHeader'
import StorySection from './components/StorySection'

export default function HomePage() {
  return <div className="storefront"><StoreHeader />
    <main>
      <HeroSlider />
      <StorySection />
      <CollectionsSection />
      <OccasionSection />
      <FaqSection />
      <Newsletter />
    </main><StoreFooter />
  </div>
}
