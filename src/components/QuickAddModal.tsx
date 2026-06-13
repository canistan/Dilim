'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

export type ProductForModal = {
  id: string | number;
  title: string;
  slug?: string;
  price: number;
  image: string;
  hasSizes?: boolean;
  sizes?: { size: string; price: number }[];
}

type QuickAddModalProps = {
  product: ProductForModal | null;
  isOpen: boolean;
  onClose: () => void;
  crossSellProducts?: { id: string; name: string; price: number; image: string }[];
}

export function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const [cakeMessage, setCakeMessage] = useState('')
  const [showCrossSell, setShowCrossSell] = useState(false)
  const [addedCrossSells, setAddedCrossSells] = useState<Record<string, boolean>>({})
  const { addToCart, items, cartTotal, setIsCartOpen } = useCart()

  // Modal her açıldığında stateleri sıfırla
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setSelectedSize(null)
      setShowError(false)
      setCakeMessage('')
      setShowCrossSell(false)
      setAddedCrossSells({})
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
    
    // Pasta yazısı varsa options içine formatla
    let optionsText = cakeMessage.trim() ? `Yazı: "${cakeMessage.trim()}"` : undefined;

    if (product.hasSizes && selectedSize && product.sizes) {
      const sizeObj = product.sizes.find(s => s.size === selectedSize);
      if (sizeObj) {
        finalId = `${product.id}-${selectedSize.replace(/\s+/g, '-')}`;
        finalPrice = `₺${sizeObj.price}`;
        optionsText = optionsText ? `Boyut: ${selectedSize} | ${optionsText}` : `Boyut: ${selectedSize}`;
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
    
    toast.success('Ürün sepetinize eklendi!');
    if (crossSellProducts && crossSellProducts.length > 0) {
      setShowCrossSell(true);
    } else {
      onClose();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
      {/* Arka plan overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-full">
        {/* Kapat butonu */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-dilim-siyah hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sol Sütun: Büyük Görsel */}
        <div className="w-full md:w-[45%] h-[250px] md:h-auto relative bg-gray-50 shrink-0">
          <Image 
            src={product.image} 
            alt={product.title} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>

        {/* Sağ Sütun: İçerik ve Form */}
        <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          <h3 className="text-3xl font-serif font-bold text-dilim-siyah leading-tight mb-2 pr-8">
            {product.title}
          </h3>
          
          <div className="text-2xl font-bold text-dilim-siyah flex items-end gap-2 mb-8">
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

          {/* Boyut Seçimi */}
          {product.hasSizes && product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => {
                      setSelectedSize(s.size);
                      setShowError(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border ${
                      selectedSize === s.size
                        ? 'border-dilim-portakal bg-white text-dilim-portakal ring-1 ring-dilim-portakal shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className="font-normal opacity-70">₺{s.price}</span>
                  </button>
                ))}
              </div>
              {showError && <span className="text-red-500 text-xs font-medium block mt-2 animate-pulse">Lütfen sepete eklemeden önce boyut seçiniz.</span>}
            </div>
          )}

          {/* Pasta Yazısı Input */}
          <div className="mb-8">
            <input 
              type="text" 
              placeholder="Pasta üzerine yazılacak yazı. (Maksimum 50 Karakter)"
              maxLength={50}
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-dilim-portakal focus:ring-1 focus:ring-dilim-portakal transition-all text-sm text-dilim-siyah placeholder:text-gray-400"
            />
          </div>

          {/* Alt Butonlar */}
          <div className="mt-auto flex flex-col gap-3">
            <div className="flex gap-3">
              {/* Adet Seçici */}
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-1 w-28 shrink-0 bg-white">
                <button 
                  onClick={handleDecrease}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-dilim-siyah hover:bg-gray-50 rounded-lg transition-colors text-lg"
                >
                  -
                </button>
                <span className="font-bold text-dilim-siyah text-center w-6">{quantity}</span>
                <button 
                  onClick={handleIncrease}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-dilim-siyah hover:bg-gray-50 rounded-lg transition-colors text-lg"
                >
                  +
                </button>
              </div>

              {/* Sepete Ekle */}
              <button
                onClick={handleAdd}
                className="flex-1 bg-dilim-portakal hover:bg-dilim-turuncu text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors py-3.5 shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                Sepete Ekle
              </button>
            </div>

            {/* Tüm Detayları Gör */}
            {product.slug && (
              <Link 
                href={`/urunler/${product.slug}`}
                onClick={onClose}
                className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Tüm Detayları Gör
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Sell Modal (Nuga Style Confirmation) */}
      {showCrossSell && crossSellProducts && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowCrossSell(false); onClose(); }} />
          <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => { setShowCrossSell(false); onClose(); }}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              <div className="p-6 border-b border-gray-100 text-center flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-4">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm">Az önce ekledin</span>
                </div>
                
                <div className="flex items-center gap-4 text-left w-full max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dilim-siyah leading-tight text-sm">{product.title}</h3>
                    {selectedSize && <p className="text-xs text-gray-500 mt-1">{selectedSize}</p>}
                    <p className="text-sm font-bold text-dilim-portakal mt-1">₺{displayPrice}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-500 italic">"{product.title}" Ekstralar ↓</h4>
              </div>

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
                  onClose();
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
