'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

export type ProductForModal = {
  id: string | number;
  title: string;
  price: number;
  image: string;
  hasSizes?: boolean;
  sizes?: { size: string; price: number }[];
}

type QuickAddModalProps = {
  product: ProductForModal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const { addToCart } = useCart()

  // Reset state when a new product is opened
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setSelectedSize(null)
      setShowError(false)
    }
  }, [isOpen, product])

  if (!isOpen || !product) return null

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

    let finalId = product.id.toString();
    let finalPrice = `₺${product.price}`;
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
      name: product.title,
      price: finalPrice,
      image: product.image,
      quantity: quantity,
      options: optionsText
    })
    
    // Close modal after adding
    onClose();
  }

  const basePrice = (product.hasSizes && selectedSize && product.sizes) 
    ? product.sizes.find(s => s.size === selectedSize)?.price
    : (product.hasSizes && product.sizes && product.sizes.length > 0)
      ? Math.min(...product.sizes.map(s => s.price))
      : product.price;

  const displayPrice = basePrice ? Number(basePrice) * quantity : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-dilim-siyah hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex p-6 gap-6 border-b border-gray-100 shrink-0">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 shrink-0 shadow-sm border border-gray-100">
            <Image 
              src={product.image} 
              alt={product.title} 
              fill 
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold text-dilim-siyah leading-tight mb-2">
              {product.title}
            </h3>
            <div className="text-2xl font-bold text-dilim-portakal flex items-end gap-2">
              {displayPrice && displayPrice > 0 ? (
                <>
                  <span>₺{displayPrice}</span>
                  {quantity > 1 && (
                    <span className="text-sm font-normal text-gray-500 mb-0.5">
                      (₺{basePrice} x {quantity})
                    </span>
                  )}
                </>
              ) : 'Özel Fiyat'}
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {product.hasSizes && product.sizes && product.sizes.length > 0 && (
            <div className={`mb-8 p-5 rounded-2xl border-2 transition-all duration-300 ${showError ? 'border-red-400 bg-red-50/50 shadow-[0_0_15px_rgba(248,113,113,0.3)]' : 'border-gray-100 bg-gray-50'}`}>
              <h4 className="text-sm font-bold text-dilim-siyah mb-4 flex items-center justify-between">
                <span>Pastanızın Boyutunu Seçiniz <span className="text-red-500">*</span></span>
                {showError && <span className="text-red-500 text-xs animate-pulse font-medium">Zorunlu Seçim</span>}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => {
                      setSelectedSize(s.size);
                      setShowError(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 text-center flex flex-col items-center justify-center ${
                      selectedSize === s.size
                        ? 'bg-dilim-portakal text-white shadow-md transform scale-[1.02] border-2 border-dilim-portakal'
                        : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-dilim-portakal/50'
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className={`text-xs mt-1 ${selectedSize === s.size ? 'text-white/90' : 'text-gray-400 font-normal'}`}>
                      ₺{s.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex items-center justify-between border-2 border-gray-100 rounded-2xl p-2 w-32 shrink-0 bg-white">
              <button 
                onClick={handleDecrease}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-dilim-siyah hover:bg-gray-50 rounded-xl transition-colors text-xl"
              >
                -
              </button>
              <span className="font-bold text-dilim-siyah w-8 text-center">{quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-dilim-siyah hover:bg-gray-50 rounded-xl transition-colors text-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 bg-dilim-siyah hover:bg-black text-white px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors group text-lg shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Sepete Ekle
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
