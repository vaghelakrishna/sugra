import type { ReactNode } from 'react'
import StoreHeader from '../home/components/StoreHeader'
import StoreFooter from '../home/components/StoreFooter'

interface StoreShellProps {
  children: ReactNode
}

export default function StoreShell({ children }: StoreShellProps) {
  return (
    <div className="storefront">
      <StoreHeader />
      {children}
      <StoreFooter />
    </div>
  )
}

export { StoreShell as Shell }

