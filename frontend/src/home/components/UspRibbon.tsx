import { Sparkles, Droplets, ShieldCheck, Zap, RotateCcw } from 'lucide-react'

const usps = [
  {
    icon: Sparkles,
    title: '18K Gold Plated',
    subtitle: 'Thick 2.5 Micron PVD coating',
  },
  {
    icon: Droplets,
    title: '100% Waterproof',
    subtitle: 'Shower, swim & sweat safe',
  },
  {
    icon: ShieldCheck,
    title: 'Hypoallergenic',
    subtitle: 'Zero nickel, no green skin',
  },
  {
    icon: Zap,
    title: 'Express Dispatch',
    subtitle: 'Shipped within 24–48 hours',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    subtitle: 'Hassle-free guarantee',
  },
]

export default function UspRibbon() {
  return (
    <section className="border-y border-[#ede6de] bg-[#fbf9f6] py-8 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {usps.map((usp, idx) => {
            const Icon = usp.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 p-2 transition-transform hover:-translate-y-0.5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f2ebd9] text-[#875c35] shadow-xs">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-[13px] sm:text-[14px] font-bold tracking-[0.05em] text-[#221c18] uppercase">
                    {usp.title}
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#786c62] leading-tight mt-0.5">
                    {usp.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

