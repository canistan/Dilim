"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem('dilim_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from local storage', error)
      }
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dilim_cart', JSON.stringify(items))
    }
  }, [items, isMounted])

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id)
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        )
      }
      return [...prev, newItem]
    })
    setIsCartOpen(true) // Otomatik olarak sepeti aç
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Helper to parse price string like "₺750" or "₺450/kg" to a number for calculation
  const parsePrice = (priceStr: string) => {
    // Sadece sayıları al
    const match = priceStr.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  const cartTotal = items.reduce((total, item) => total + (parsePrice(item.price) * item.quantity), 0)

  // Don't render cart contents that depend on localStorage until mounted in the consumer components,
  // but ALWAYS provide the context to avoid useCart throwing errors.

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
