import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Metadata } from 'next'
import { ClearCartOnMount } from '@/components/ClearCartOnMount'
import { IframeBreakout } from '@/components/IframeBreakout'

export const metadata: Metadata = {
  title: 'Ödeme Başarılı | Dilim Pastaneleri',
}

export default async function BasariliPage(props: { searchParams: Promise<{ orderNumber?: string }> }) {
  const searchParams = await props.searchParams;
  const orderNumber = searchParams.orderNumber || '';

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center py-20">
      <IframeBreakout />
      <ClearCartOnMount />
      <div className="container mx-auto px-4 max-w-xl text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-dilim-siyah mb-4">Siparişiniz Alındı!</h1>
        {orderNumber && <p className="text-gray-500 mb-6 font-mono bg-gray-50 py-2 px-4 rounded-lg inline-block">Sipariş No: {orderNumber}</p>}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Bizi tercih ettiğiniz için teşekkür ederiz. Siparişiniz başarıyla oluşturuldu ve ödemeniz alındı. Sipariş durumunuzla ilgili e-posta yoluyla bilgilendirileceksiniz.
        </p>
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <Link href="/urunler" className="inline-block w-full px-10 py-4 bg-dilim-portakal text-white font-bold rounded-full hover:bg-dilim-turuncu shadow-lg shadow-dilim-portakal/30 transition-all">
            Alışverişe Devam Et
          </Link>
          <Link href="/" className="inline-block w-full px-10 py-4 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-all">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
