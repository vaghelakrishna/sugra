import { Sparkles, Gem, ShieldCheck, RefreshCw, Award } from 'lucide-react'

const BADGES = [
  {
    icon: Sparkles,
    title: 'Anti-Tarnish',
    desc: 'Water & Sweat Proof',
  },
  {
    icon: Gem,
    title: '18K Gold Plated',
    desc: 'Luxurious Shine',
  },
  {
    icon: ShieldCheck,
    title: 'Hypoallergenic',
    desc: 'Skin Safe & Nickel Free',
  },
  {
    icon: RefreshCw,
    title: '7-Day Returns',
    desc: 'Hassle-free Exchange',
  },
  {
    icon: Award,
    title: '1-Year Warranty',
    desc: 'Plating Guaranteed',
  },
]

export default function JewelryTrustBadges() {
  return (
    <div className="jewelry-trust-strip">
      <div className="trust-badges-grid">
        {BADGES.map((badge, idx) => {
          const Icon = badge.icon
          return (
            <div key={idx} className="trust-badge-item">
              <div className="badge-icon-box">
                <Icon size={20} />
              </div>
              <span className="badge-title">{badge.title}</span>
              <small className="badge-desc">{badge.desc}</small>
            </div>
          )
        })}
      </div>
    </div>
  )
}

