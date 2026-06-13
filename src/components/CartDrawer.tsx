"use client"

import { useCart } from '@/context/CartContext'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-dilim-siyah" />
                <h2 className="text-xl font-serif font-bold text-dilim-siyah">Sepetim</h2>
                <span className="bg-dilim-portakal text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-dilim-siyah transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 text-gray-200" />
                  <p className="text-lg font-medium mb-2">Sepetiniz şu an boş</p>
                  <p className="text-sm font-light mb-6">Özel lezzetlerimizi incelemek için ürünler sayfasına göz atabilirsiniz.</p>
                  <Link
                    href="/urunler"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-block bg-dilim-siyah text-white px-8 py-3 rounded-full font-bold hover:bg-dilim-portakal transition-colors"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      {/* Item Image */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-dilim-siyah leading-tight text-sm pr-4">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.options && (
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                            {item.options}
                          </p>
                        )}
                        <div className="text-dilim-portakal font-bold text-sm mb-3">
                          {item.price}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white w-24 h-8">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex-1 flex items-center justify-center text-gray-500 hover:text-dilim-siyah transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="flex-1 flex items-center justify-center font-bold text-sm border-x border-gray-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex-1 flex items-center justify-center text-gray-500 hover:text-dilim-siyah transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-500 font-medium">Ara Toplam</span>
                  <span className="text-2xl font-serif font-bold text-dilim-siyah">₺{cartTotal}</span>
                </div>
                <Link
                  href="/odeme"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-dilim-siyah text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-dilim-portakal transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  Ödemeye Geç
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
