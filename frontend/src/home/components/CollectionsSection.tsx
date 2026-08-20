import { collections } from '../data'

export default function CollectionsSection() {
  return <section className="collection-section" id="collections"><div className="section-heading"><div><p className="eyebrow">SHOP BY FORM</p><h2>Find your signature.</h2></div><a className="text-link" href="#collections">View all pieces <span>↗</span></a></div><div className="collection-grid">{collections.map(collection => <a className="collection-card" href="#collections" key={collection.name}><img src={collection.image} alt={collection.name} /><div><h3>{collection.name}</h3><span>{collection.count}</span></div></a>)}</div></section>
}
