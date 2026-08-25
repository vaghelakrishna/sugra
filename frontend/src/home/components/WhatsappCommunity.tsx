export default function WhatsappCommunity() {
  return (
    <section className="bg-white py-14 sm:py-20 border-t border-[#f0eae2] overflow-hidden">
      <div className="mx-auto max-w-[1350px] px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT SIDE: TEXT CONTENT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg mx-auto md:mx-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333] mb-3">
              #SUGRAGANG
            </span>

            <h2 className="font-sans text-[28px] sm:text-[38px] font-bold text-[#111] leading-[1.15] mb-4">
              Join our Whatsapp Community
            </h2>

            <p className="text-[14px] sm:text-[15px] text-[#444] leading-relaxed mb-8 max-w-md">
              Join our whatsapp community and receive latest updates and offers! Get Instant 15% Off after joining our community.
            </p>

            <a
              href="https://wa.me/919059396361"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-black text-white px-8 py-3 font-sans text-[12px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-[#25D366]"
            >
              Join Now
            </a>
          </div>

          {/* RIGHT SIDE: OVERLAPPING ARTISTIC GRAPHIC CARDS MATCHING SCREENSHOT 1 */}
          <div className="relative flex justify-center md:justify-end items-center py-4">
            {/* BACK CARD: ILLUSTRATION OF WOMEN WEARING JEWELRY */}
            <div className="relative w-[260px] sm:w-[310px] aspect-[4/5] overflow-hidden rounded-xs bg-[#f4ebd0] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Community of women wearing fashion jewelry"
                className="h-full w-full object-cover saturate-[.85]"
              />
            </div>

            {/* FRONT OVERLAPPING CARD WITH SCRIPT TEXT (MATCHING SCREENSHOT 1) */}
            <div className="absolute bottom-0 right-0 sm:right-4 w-[210px] sm:w-[250px] aspect-square bg-[#faeecf] p-6 shadow-xl border border-[#e8ded0] flex flex-col justify-center items-center text-center transform translate-x-2 translate-y-4">
              <span className="font-serif italic text-[24px] sm:text-[30px] text-[#2e402e] leading-tight mb-1">
                Join our
              </span>
              <h3 className="font-serif text-[22px] sm:text-[28px] text-[#2e402e] font-normal leading-tight">
                Whatsapp<br />Community
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
