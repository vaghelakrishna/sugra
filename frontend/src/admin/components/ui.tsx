export const money=(n=0)=>`₹${n.toLocaleString('en-IN')}`
export const when=(x?:string)=>x?new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(new Date(x)):'—'
export const pic=(src?:string)=><span className="thumb">{src?<img src={src} alt=""/>:'◇'}</span>
export const pill=(text:string)=><span className={'pill '+text.toLowerCase().replaceAll(' ','-')}>{text}</span>
