import { useState, useEffect } from 'react'
import { Truck, CheckCircle2, AlertCircle, RotateCcw, Banknote } from 'lucide-react'

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [deliveryDate, setDeliveryDate] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('sugra_delivery_pincode')
    if (saved && /^\d{6}$/.test(saved)) {
      setPincode(saved)
      calculateDelivery(saved)
    }
  }, [])

  const calculateDelivery = (pin: string) => {
    setStatus('checking')
    setTimeout(() => {
      if (/^\d{6}$/.test(pin)) {
        const date = new Date()
        date.setDate(date.getDate() + 4)
        const formatted = date.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
        setDeliveryDate(formatted)
        setStatus('valid')
        localStorage.setItem('sugra_delivery_pincode', pin)
      } else {
        setStatus('invalid')
      }
    }, 350)
  }

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    calculateDelivery(pincode.trim())
  }

  return (
    <div className="pincode-checker-box">
      <div className="pincode-header">
        <Truck size={16} className="pincode-icon" />
        <span>Estimated Delivery & COD Check</span>
      </div>

      <form onSubmit={handleCheck} className="pincode-form">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '')
            setPincode(val)
            if (status !== 'idle') setStatus('idle')
          }}
          className="pincode-input"
        />
        <button
          type="submit"
          className="pincode-btn"
          disabled={pincode.length < 6 || status === 'checking'}
        >
          {status === 'checking' ? 'Checking...' : status === 'valid' ? 'Change' : 'Check'}
        </button>
      </form>

      {status === 'invalid' && (
        <div className="pincode-result invalid">
          <AlertCircle size={15} />
          <span>Please enter a valid 6-digit postal pincode.</span>
        </div>
      )}

      {status === 'valid' && (
        <div className="pincode-result valid">
          <div className="delivery-time">
            <CheckCircle2 size={16} className="check-icon" />
            <span>
              Expected Delivery by <strong>{deliveryDate}</strong>
            </span>
          </div>
          <div className="delivery-perks">
            <span>
              <Banknote size={14} /> Cash on Delivery Available
            </span>
            <span>
              <RotateCcw size={14} /> 7-Day Hassle-Free Returns
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

