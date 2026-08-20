export default function Newsletter() {
  return <section className="newsletter"><p className="eyebrow">A NOTE FROM SUGRA</p><h2>Stay close.</h2><p>New pieces, studio notes, and things worth keeping.</p><form onSubmit={event => event.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Your email address" required /><button aria-label="Subscribe">→</button></form></section>
}
