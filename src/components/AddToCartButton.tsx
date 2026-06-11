"use client"

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

type AddToCartProps = {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    hasSizes?: boolean;
    sizes?: { size: string; price: number }[];
  }
  description?: string;
}

export function AddToCartButton({ product, description }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const { addToCart } = useCart()

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const handleIncrease = () => {
    setQuantity(q => q + 1)
  }

  const handleAdd = () => {
    if (product.hasSizes && !selectedSize) {
      setShowError(true);
      toast.error('Lütfen sepete eklemeden önce boyut seçiniz.');
      return;
    }

    let finalId = product.id;
    let finalPrice = product.price;
    let optionsText = undefined;

    if (product.hasSizes && selectedSize && product.sizes) {
      const sizeObj = product.sizes.find(s => s.size === selectedSize);
      if (sizeObj) {
        finalId = `${product.id}-${selectedSize.replace(/\s+/g, '-')}`;
        finalPrice = `₺${sizeObj.price}`;
        optionsText = `Boyut: ${selectedSize}`;
      }
    }

    addToCart({
      id: finalId,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: quantity,
      options: optionsText
    })
  }

  const basePrice = (product.hasSizes && selectedSize && product.sizes) 
    ? product.sizes.find(s => s.size === selectedSize)?.price
    : (product.hasSizes && product.sizes && product.sizes.length > 0)
      ? Math.min(...product.sizes.map(s => s.price))
      : product.price;

  const displayPrice = basePrice ? Number(basePrice) * quantity : null;

  return (
    <div className="w-full">
      
      <div className="text-3xl font-serif font-bold text-dilim-siyah mb-8 transition-all duration-300 flex items-end gap-3">
        {displayPrice && displayPrice > 0 ? (
          <>
            <span>₺{displayPrice}</span>
            {quantity > 1 && (
              <span className="text-sm font-normal text-gray-500 mb-1 pb-1">
                (₺{basePrice} x {quantity} Adet)
              </span>
            )}
          </>
        ) : 'Özel Fiyat'}
      </div>

      <p className="text-gray-600 text-lg leading-relaxed mb-10 font-light whitespace-pre-wrap">
        {description}
      </p>

      {product.hasSizes && product.sizes && product.sizes.length > 0 && (
        <div className={`mb-6 p-5 rounded-2xl border-2 transition-all duration-300 ${showError ? 'border-red-400 bg-red-50/50 shadow-[0_0_15px_rgba(248,113,113,0.3)]' : 'border-gray-100 bg-gray-50'}`}>
          <h4 className="text-sm font-bold text-dilim-siyah mb-3 flex items-center justify-between">
            <span>Pastanızın Boyutunu Seçiniz <span className="text-red-500">*</span></span>
            {showError && <span className="text-red-500 text-xs animate-pulse font-medium">Zorunlu Seçim</span>}
          </h4>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => {
                  setSelectedSize(s.size);
                  setShowError(false);
                }}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex-1 min-w-[120px] ${
                  selectedSize === s.size
                    ? 'bg-dilim-portakal text-white shadow-lg transform scale-[1.02] border-2 border-dilim-portakal'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-dilim-portakal/50'
                }`}
              >
                {s.size} <span className={`block text-xs mt-1 opacity-90 ${selectedSize === s.size ? 'text-white' : 'text-gray-400 font-normal'}`}>(₺{s.price})</span>
              </button>
            ))}
          </div>
        </div>
      )}

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
    </div>
  )
}
