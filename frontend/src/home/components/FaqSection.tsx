const faqs = [
  { question: 'How do I care for my SUGRA pieces?', answer: 'Keep your jewellery away from perfume, water, and lotions. When not wearing it, store each piece in its SUGRA pouch and gently polish it with a soft, dry cloth.' },
  { question: 'How long will my order take to arrive?', answer: 'Orders are carefully packed within 1–2 business days. Complimentary standard shipping usually arrives within 3–5 business days after dispatch.' },
  { question: 'Can I return or exchange my order?', answer: 'We accept returns of unworn pieces in their original packaging within 14 days of delivery. Please contact our care team to start a return.' },
  { question: 'Do you offer gift wrapping?', answer: 'Every SUGRA order arrives beautifully wrapped. You can also add a personal note at checkout for a thoughtful finishing touch.' },
]

export default function FaqSection() {
  return <section className="bg-[#eee8df] px-[5.5vw] py-24 max-[700px]:px-[18px] max-[700px]:py-20" id="faq">
    <div className="grid grid-cols-[.8fr_1.2fr] gap-20 max-[850px]:grid-cols-1 max-[850px]:gap-10">
      <div><p className="mb-4 text-[10px] font-bold tracking-[2.4px] text-[#b98550]">SUGRA CARE</p><h2 className="m-0 max-w-[380px] font-serif text-[clamp(38px,5vw,66px)] leading-[.98] text-[#2f2925]">Questions,<br /><em className="text-[#ae7a45]">answered.</em></h2><p className="mt-7 max-w-[300px] text-sm leading-7 text-[#81756c]">Everything you need to know before your next favourite piece finds you.</p></div>
      <div className="border-t border-[#cfc2b4]">{faqs.map(faq => <details className="group border-b border-[#cfc2b4]" key={faq.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-[20px] text-[#3b312a] marker:hidden max-[700px]:text-[17px]"><span>{faq.question}</span><span className="text-2xl font-light text-[#a67542] transition-transform duration-300 group-open:rotate-45">+</span></summary><p className="max-w-[620px] pb-6 pr-10 text-sm leading-7 text-[#81756c]">{faq.answer}</p></details>)}</div>
    </div>
  </section>
}
