"use client"

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type AddToCartProps = {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  }
}

export function AddToCartButton({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const handleIncrease = () => {
    setQuantity(q => q + 1)
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      <div className="flex items-center justify-between border-2 border-gray-100 rounded-2xl p-2 w-full sm:w-40 bg-white">
        <button 
          onClick={handleDecrease}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-gray-500 hover:bg-gray-100 hover:text-dilim-siyah transition-colors"
        >
          -
        </button>
        <span className="text-lg font-bold text-dilim-siyah">{quantity}</span>
        <button 
          onClick={handleIncrease}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-gray-500 hover:bg-gray-100 hover:text-dilim-siyah transition-colors"
        >
          +
        </button>
      </div>
      
      <button 
        onClick={handleAdd}
        className="flex-1 bg-dilim-siyah text-white rounded-2xl py-4 px-8 font-bold text-lg flex items-center justify-center gap-3 hover:bg-dilim-portakal transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
      >
        <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
        Sepete Ekle
      </button>
    </div>
  )
}
