const images = [
  ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85', 'The art of the everyday'],
  ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=85', 'A study in gold'],
  ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85', 'Objects in the wild'],
  ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85', 'Notes from the studio'],
]

export default function EditorialGallery() {
  return <section className="editorial-section"><div className="section-heading"><div><p className="eyebrow">FROM THE JOURNAL</p><h2>Seen in the world.</h2></div><a className="text-link" href="#journal">Visit the journal <span>↗</span></a></div><div className="editorial-grid">{images.map(([image, label]) => <a href="#journal" key={label}><img src={image} alt={label} /><span>{label}</span></a>)}</div></section>
}
