'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

type CrossSellModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: { title: string; image: string; selectedSize?: string | null; displayPrice: string | number | null };
  crossSellProducts: any[];
}

export function CrossSellModal({ isOpen, onClose, product, crossSellProducts }: CrossSellModalProps) {
  const { addToCart, items, cartTotal, setIsCartOpen } = useCart()
  const [addedCrossSells, setAddedCrossSells] = useState<Record<string, boolean>>({})

  if (!isOpen || !crossSellProducts || crossSellProducts.length === 0) return null

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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="p-6 border-b-2 border-gray-100 text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-dilim-portakal font-bold mb-4">
              <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                <svg className="w-4 h-4 text-dilim-portakal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-sm uppercase tracking-wide">Az Önce Ekledin</span>
            </div>
            
            <div className="flex items-center gap-4 text-left w-full max-w-sm mx-auto bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-white">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-dilim-siyah leading-tight text-sm">{product.title}</h3>
                {product.selectedSize && <p className="text-xs text-gray-500 mt-1">{product.selectedSize}</p>}
                <p className="text-sm font-bold text-dilim-siyah mt-1">₺{product.displayPrice}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-500 italic">Birlikte İyi Gider ↓</h4>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Önerilenler</span>
          </div>

          <div className="px-6 py-2">
            {crossSellProducts.map((cs) => {
              const isAdded = addedCrossSells[cs.id]
              return (
                <div key={cs.id} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden relative shrink-0 border border-gray-100 p-1">
                    <img src={cs.image} alt={cs.name} className="object-cover w-full h-full rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-dilim-siyah text-sm leading-tight mb-1">{cs.name}</h4>
                    <div className="text-dilim-siyah font-bold text-sm">₺{Number(cs.price).toFixed(2)}</div>
                  </div>
                  <div className="shrink-0">
                    {isAdded ? (
                      <div className="px-4 py-2 bg-orange-50 text-dilim-portakal border border-orange-200 text-xs font-bold rounded-xl flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        EKLENDİ
                      </div>
                    ) : (
                      <button 
                        onClick={() => addCrossSellItem(cs)} 
                        className="px-4 py-2 bg-dilim-siyah hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5"
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

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="relative bg-gray-50 p-3 rounded-xl border border-gray-100">
              <ShoppingBag className="w-5 h-5 text-dilim-siyah" />
              <div className="absolute -top-2 -right-2 bg-dilim-portakal text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Ara Toplam</div>
              <div className="font-bold text-lg text-dilim-siyah leading-none">
                ₺{cartTotal.toFixed(2)}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            className="bg-dilim-portakal hover:bg-dilim-turuncu text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            SEPETİ GÖRÜNTÜLE
          </button>
        </div>
      </div>
    </div>
  )
}
