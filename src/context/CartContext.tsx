"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  options?: string;
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

  // Dismiss all toast popups when cart sidebar is opened
  useEffect(() => {
    if (isCartOpen) {
      toast.dismiss();
    }
  }, [isCartOpen])

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
    
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-in slide-in-from-bottom-5' : 'animate-out fade-out'
        } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col sm:flex-row border-2 border-dilim-portakal/20 p-5 items-center gap-5`}
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
          <img src={newItem.image} alt={newItem.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-base font-bold text-dilim-siyah line-clamp-1">{newItem.name}</p>
          <p className="text-sm font-medium text-green-600 flex items-center justify-center sm:justify-start gap-1 mt-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Sepete eklendi
          </p>
        </div>
        <div className="w-full sm:w-auto flex border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsCartOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-dilim-siyah text-white text-sm font-bold rounded-xl hover:bg-dilim-portakal transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Sepete Git
          </button>
        </div>
      </div>
    ), { position: 'bottom-right', duration: 4000 })
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dilim_cart')
    }
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
