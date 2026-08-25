import { Link } from 'react-router-dom'

export default function RakhiSection() {
  return (
    <section className="bg-[#fffdfa] py-12 sm:py-20 border-t border-[#f3ede6]">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
        {/* =========================================================================
            1. TOP HERO BANNER & HEADING (EXACT MATCH FOR SCREENSHOT)
            ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif text-[26px] sm:text-[38px] md:text-[44px] font-normal text-[#38171e] leading-tight">
            A bond this special
            <span className="block font-serif italic text-[#844338] text-[28px] sm:text-[40px] md:text-[46px] mt-1 font-normal">
              deserves a little gold
            </span>
          </h2>

          <p className="font-sans text-[12px] sm:text-[14px] text-[#73665c] mt-3 sm:mt-4 leading-relaxed max-w-lg mx-auto">
            Thoughtful rakhis and keepsake gifts, made for every kind of sibling love.
          </p>

          <Link
            to="/collections/all?category=rakhi"
            className="inline-flex items-center gap-2 mt-6 sm:mt-7 bg-[#48121d] hover:bg-[#631c2a] text-white px-7 py-3 rounded-md text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>Shop Rakhi Gifts</span>
            <span>→</span>
          </Link>
        </div>

        {/* =========================================================================
            2. SUBSECTION 1: RAKHI CATEGORIES (3 COLUMNS)
            ========================================================================= */}
        <div className="mb-14 sm:mb-20">
          <h3 className="font-serif text-[20px] sm:text-[28px] font-normal text-[#38171e] text-center mb-6 sm:mb-8 tracking-wide">
            Rakhi Categories
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {/* CARD 1: ALL RAKHI */}
            <Link
              to="/collections/all?category=rakhi"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[#f5ede3] shadow-xs border border-[#eee4d8] relative">
                <img
                  src="https://images.unsplash.com/photo-1627885273187-5c20d7f95038?auto=format&fit=crop&w=800&q=80"
                  alt="All Rakhi"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-[12px] sm:text-[13px] font-medium tracking-[0.12em] text-[#333] mt-3 group-hover:text-[#844338] transition-colors">
                All Rakhi
              </span>
            </Link>

            {/* CARD 2: SET OF TWO */}
            <Link
              to="/collections/all?category=rakhi&type=set-of-2"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[#f5ede3] shadow-xs border border-[#eee4d8] relative">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
                  alt="Set of Two"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-[12px] sm:text-[13px] font-medium tracking-[0.12em] text-[#333] mt-3 group-hover:text-[#844338] transition-colors">
                Set of Two
              </span>
            </Link>

            {/* CARD 3: RAKHI BUNDLE */}
            <Link
              to="/collections/all?category=rakhi&type=bundle"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[#f5ede3] shadow-xs border border-[#eee4d8] relative">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
                  alt="Rakhi Bundle"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-[12px] sm:text-[13px] font-medium tracking-[0.12em] text-[#333] mt-3 group-hover:text-[#844338] transition-colors">
                Rakhi Bundle
              </span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            3. SUBSECTION 2: RAKHI BY METAL (2 COLUMNS)
            ========================================================================= */}
        <div className="mb-14 sm:mb-20">
          <h3 className="font-serif text-[20px] sm:text-[28px] font-normal text-[#38171e] text-center mb-6 sm:mb-8 tracking-wide">
            Rakhi By Metal
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {/* CARD 1: SILVER RAKHI WITH PREMIUM BADGE */}
            <Link
              to="/collections/all?category=rakhi&metal=silver"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[#f5ede3] shadow-xs border border-[#eee4d8] relative">
                {/* PREMIUM BADGE (MATCHING SCREENSHOT) */}
                <span className="absolute top-3.5 left-3.5 z-10 bg-[#1c1a19]/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
                  PREMIUM
                </span>
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
                  alt="Silver Rakhi"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-[12px] sm:text-[13px] font-medium tracking-[0.12em] text-[#333] mt-3 group-hover:text-[#844338] transition-colors">
                Silver Rakhi
              </span>
            </Link>

            {/* CARD 2: DEMIFINE RAKHI */}
            <Link
              to="/collections/all?category=rakhi&metal=demifine"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[#f5ede3] shadow-xs border border-[#eee4d8] relative">
                <img
                  src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=80"
                  alt="Demifine Rakhi"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-sans text-[12px] sm:text-[13px] font-medium tracking-[0.12em] text-[#333] mt-3 group-hover:text-[#844338] transition-colors">
                Demifine Rakhi
              </span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            4. SUBSECTION 3: RAKHI GIFTS FOR (SISTER & BROTHER BANNERS)
            ========================================================================= */}
        <div>
          <h3 className="font-serif text-[20px] sm:text-[28px] font-normal text-[#38171e] text-center mb-6 sm:mb-8 tracking-wide">
            Rakhi Gifts For
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {/* BANNER 1: RAKHI GIFT BOX FOR SISTER */}
            <Link
              to="/collections/all?category=rakhi&for=sister"
              className="group relative aspect-[16/8] sm:aspect-[16/9] overflow-hidden rounded-xl sm:rounded-2xl bg-[#1e1513] shadow-sm flex items-center"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                alt="Rakhi Gift Box for Sister"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 text-white max-w-xs">
                <h4 className="font-serif text-[18px] sm:text-[24px] font-normal leading-tight text-white mb-1.5">
                  Rakhi Gift Box for Sister
                </h4>
                <p className="font-sans text-[11px] sm:text-[12px] text-white/80 mb-4">
                  2 Best Sellers Plus Mirror
                </p>
                <span className="inline-block bg-white text-[#111] group-hover:bg-[#844338] group-hover:text-white px-4 py-2 rounded-xs text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                  SHOP NOW
                </span>
              </div>
            </Link>

            {/* BANNER 2: RAKHI GIFTS FOR BROTHER */}
            <Link
              to="/collections/all?category=rakhi&for=brother"
              className="group relative aspect-[16/8] sm:aspect-[16/9] overflow-hidden rounded-xl sm:rounded-2xl bg-[#1e1513] shadow-sm flex items-center"
            >
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80"
                alt="Rakhi Gifts for Brother"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 text-white max-w-xs">
                <h4 className="font-serif text-[18px] sm:text-[24px] font-normal leading-tight text-white mb-1.5">
                  Rakhi Gifts for Brother
                </h4>
                <p className="font-sans text-[11px] sm:text-[12px] text-white/80 mb-4">
                  Curated Demifine Sets & Watch Charms
                </p>
                <span className="inline-block bg-white text-[#111] group-hover:bg-[#844338] group-hover:text-white px-4 py-2 rounded-xs text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                  SHOP NOW
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

