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
  const [selectedCrossSells, setSelectedCrossSells] = useState<Record<string, number>>({}) // id -> quantity
  
  const { addToCart } = useCart()

  const isCake = product.categoryName?.toLowerCase().includes('pasta') || product.hasSizes;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const handleIncrease = () => {
    setQuantity(q => q + 1)
  }

  const toggleCrossSell = (id: string, action: 'add' | 'remove') => {
    setSelectedCrossSells(prev => {
      const current = prev[id] || 0
      const updated = { ...prev }
      if (action === 'add') {
        updated[id] = current + 1
      } else {
        if (current <= 1) delete updated[id]
        else updated[id] = current - 1
      }
      return updated
    })
  }

  const handleInitialAdd = () => {
    if (product.hasSizes && !selectedSize) {
      setShowError(true);
      toast.error('Lütfen sepete eklemeden önce boyut seçiniz.');
      return;
    }

    if (isCake && crossSellProducts.length > 0) {
      setShowCrossSell(true);
    } else {
      executeAdd(false);
    }
  }

  const executeAdd = (closeModal: boolean = false) => {
    if (closeModal) setShowCrossSell(false);

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

    // Add main product
    addToCart({
      id: finalId,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: quantity,
      options: optionsText,
      note: note.trim() || undefined
    })

    // Add selected cross-sells
    Object.entries(selectedCrossSells).forEach(([csId, qty]) => {
      const csProd = crossSellProducts.find(p => p.id === csId)
      if (csProd) {
        addToCart({
          id: csProd.id,
          name: csProd.name,
          price: `₺${csProd.price}`,
          image: csProd.image,
          quantity: qty,
        })
      }
    })
    
    // reset cross-sells for next time
    setSelectedCrossSells({})
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

      {/* Cross-Sell Modal */}
      {showCrossSell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCrossSell(false)} />
          <div className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-dilim-siyah mb-2">Bunu da İster Misiniz?</h3>
              <p className="text-gray-500">Pastanızın yanına kutlamanızı renklendirecek ufak detaylar ekleyebilirsiniz.</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 mb-8">
              {crossSellProducts.map((cs) => {
                const qty = selectedCrossSells[cs.id] || 0
                return (
                  <div key={cs.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
                      <img src={cs.image} alt={cs.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-dilim-siyah leading-tight mb-1">{cs.name}</h4>
                      <div className="text-dilim-portakal font-bold font-serif">₺{cs.price}</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                          <button onClick={() => toggleCrossSell(cs.id, 'remove')} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-dilim-siyah hover:bg-gray-100 rounded-lg transition-colors">-</button>
                          <span className="font-bold w-4 text-center text-sm">{qty}</span>
                          <button onClick={() => toggleCrossSell(cs.id, 'add')} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-dilim-siyah hover:bg-gray-100 rounded-lg transition-colors">+</button>
                        </div>
                      ) : (
                        <button onClick={() => toggleCrossSell(cs.id, 'add')} className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-dilim-portakal hover:text-dilim-portakal text-sm font-bold text-gray-600 rounded-xl transition-all shadow-sm">
                          Ekle
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => executeAdd(true)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl py-4 px-6 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
              >
                İstemiyorum, Devam Et
              </button>
              <button 
                onClick={() => executeAdd(true)}
                className="flex-1 bg-dilim-siyah text-white rounded-2xl py-4 px-6 font-bold hover:bg-dilim-portakal transition-all text-center shadow-lg"
              >
                {Object.keys(selectedCrossSells).length > 0 ? 'Seçilenlerle Sepete Ekle' : 'Sepete Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
