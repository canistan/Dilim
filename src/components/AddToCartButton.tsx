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
    categoryName?: string;
  }
  crossSellProducts?: {
    id: string;
    name: string;
    price: number;
    image: string;
  }[];
}

export function AddToCartButton({ product, description, crossSellProducts = [] }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [showError, setShowError] = useState(false)
  
  // Cross-sell modal state
  const [showCrossSell, setShowCrossSell] = useState(false)
  const [addedCrossSells, setAddedCrossSells] = useState<Record<string, boolean>>({}) // id -> true (eklendi mi)
  
  const { addToCart, items, cartTotal, setIsCartOpen } = useCart()

  const isCake = product.categoryName?.toLowerCase().includes('pasta') || product.hasSizes;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const handleIncrease = () => {
    setQuantity(q => q + 1)
  }

  const handleInitialAdd = () => {
    if (product.hasSizes && !selectedSize) {
      setShowError(true);
      toast.error('Lütfen sepete eklemeden önce boyut seçiniz.');
      return;
    }

    // Sepete ana ürünü ekle
    let finalId = product.id;
    let finalPrice = product.price;
    let optionsText = undefined;

    if (product.hasSizes && selectedSize && product.sizes) {
      const sizeObj = product.sizes.find(s => s.size === selectedSize);
      if (sizeObj) {
        finalId = `${product.id}-${selectedSize.replace(/\\s+/g, '-')}`;
        finalPrice = `₺${sizeObj.price}`;
        optionsText = `Boyut: ${selectedSize}`;
      }
    }

    if (note.trim()) {
      finalId = `${finalId}-note-${encodeURIComponent(note.trim().substring(0, 10))}`
      optionsText = optionsText ? `${optionsText} | Not: ${note.trim()}` : `Not: ${note.trim()}`
    }

    addToCart({
      id: finalId,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: quantity,
      options: optionsText,
      note: note.trim() || undefined
    })

    if (isCake && crossSellProducts.length > 0) {
      setShowCrossSell(true);
    } else {
      setIsCartOpen(true);
    }
  }

  const addCrossSellItem = (csProd: any) => {
    addToCart({
      id: csProd.id,
      name: csProd.name,
      price: `₺${csProd.price}`,
      image: csProd.image,
      quantity: 1,
    })
    setAddedCrossSells(prev => ({ ...prev, [csProd.id]: true }))
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

      {isCake && (
        <div className="mb-6">
          <label htmlFor="cakeNote" className="block text-sm font-bold text-dilim-siyah mb-2">
            Pasta Üzerine Yazılacak Not (İsteğe Bağlı)
          </label>
          <textarea
            id="cakeNote"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-dilim-portakal focus:ring-0 outline-none transition-all resize-none text-sm"
            placeholder="Örn: İyi ki doğdun Can!"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={60}
          />
          <span className="text-xs text-gray-400 mt-1 block text-right">{note.length}/60 karakter</span>
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
        onClick={handleInitialAdd}
        className="flex-1 bg-dilim-siyah text-white rounded-2xl py-4 px-8 font-bold text-lg flex items-center justify-center gap-3 hover:bg-dilim-portakal transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
      >
        <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
        Sepete Ekle
      </button>
      </div>

      {/* Cross-Sell Modal (Nuga Style Confirmation) */}
      {showCrossSell && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCrossSell(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            {/* Header: Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setShowCrossSell(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              {/* Added Confirmation Header */}
              <div className="p-6 border-b border-gray-100 text-center flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-4">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm">Az önce ekledin</span>
                </div>
                
                <div className="flex items-center gap-4 text-left w-full max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dilim-siyah leading-tight text-sm">{product.name}</h3>
                    {selectedSize && <p className="text-xs text-gray-500 mt-1">{selectedSize}</p>}
                    <p className="text-sm font-bold text-dilim-portakal mt-1">₺{displayPrice}</p>
                  </div>
                </div>
              </div>

              {/* Cross Sell Title */}
              <div className="px-6 py-4 bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-500 italic">"{product.name}" Ekstralar ↓</h4>
              </div>

              {/* Cross Sell List */}
              <div className="px-6 py-2">
                {crossSellProducts.map((cs) => {
                  const isAdded = addedCrossSells[cs.id]
                  return (
                    <div key={cs.id} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden relative shrink-0 border border-gray-100">
                        <img src={cs.image} alt={cs.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-dilim-siyah text-sm leading-tight mb-1">{cs.name}</h4>
                        <div className="text-dilim-siyah font-bold text-sm">₺{cs.price.toFixed(2)}</div>
                      </div>
                      <div className="shrink-0">
                        {isAdded ? (
                          <div className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-lg flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            EKLENDİ
                          </div>
                        ) : (
                          <button 
                            onClick={() => addCrossSellItem(cs)} 
                            className="px-4 py-2 bg-[#F14B82] hover:bg-[#d63d6f] text-white text-xs font-bold rounded-lg transition-colors tracking-wide"
                          >
                            SEPETE EKLE
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-dilim-siyah" />
                  <div className="absolute -top-2 -right-2 bg-[#F14B82] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {items.reduce((total, item) => total + item.quantity, 0)}
                  </div>
                </div>
                <div className="font-bold text-lg text-dilim-siyah ml-2">
                  ₺{cartTotal.toFixed(2)}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setShowCrossSell(false);
                  setIsCartOpen(true);
                }}
                className="bg-[#F14B82] hover:bg-[#d63d6f] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                SEPETİ GÖRÜNTÜLE
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
