const lovedItems = [
  { quote: 'The kind of piece you never take off.', name: 'Maya R.', piece: 'Celeste Hoops' },
  { quote: 'It feels personal from the moment you put it on.', name: 'Anika S.', piece: 'Signet No. 02' },
  { quote: 'Beautifully made, beautifully understated.', name: 'Clara D.', piece: 'Luna Chain' },
]

export default function LovedSection() {
  return <section className="loved-section"><div className="section-heading"><div><p className="eyebrow">THE SUGRA COMMUNITY</p><h2>Loved by you.</h2></div><span className="loved-mark">✦</span></div><div className="loved-grid">{lovedItems.map(item => <article className="loved-card" key={item.name}><span className="stars">★★★★★</span><blockquote>“{item.quote}”</blockquote><p>{item.name} <span>· {item.piece}</span></p></article>)}</div></section>
}
