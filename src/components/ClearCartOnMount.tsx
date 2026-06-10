'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'

export function ClearCartOnMount() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart exactly once when the component mounts
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
