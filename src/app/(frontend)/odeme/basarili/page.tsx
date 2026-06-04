import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ödeme Başarılı | Dilim Pastaneleri',
}

export default async function BasariliPage(props: { searchParams: Promise<{ orderNumber?: string }> }) {
  const searchParams = await props.searchParams;
  const orderNumber = searchParams.orderNumber || '';

  const whatsappMessage = encodeURIComponent(`Merhaba, sitemizden ${orderNumber} numaralı siparişi verdim. Siparişimi onaylamak ve ödeme/teslimat adımlarını tamamlamak istiyorum.`);
  const whatsappUrl = `https://wa.me/905320000000?text=${whatsappMessage}`; // Replace phone number later if needed

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-xl text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-dilim-siyah mb-4">Sipariş Talebiniz Alındı!</h1>
        {orderNumber && <p className="text-gray-500 mb-6 font-mono bg-gray-50 py-2 px-4 rounded-lg inline-block">Sipariş No: {orderNumber}</p>}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Sipariş detaylarınız sistemimize ulaştı. Siparişinizi kesinleştirmek ve ödeme/teslimat adımlarını (Havale veya Kapıda Ödeme) tamamlamak için lütfen aşağıdaki butona tıklayarak bizimle WhatsApp üzerinden iletişime geçin.
        </p>
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full px-10 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/30 transition-all flex items-center justify-center gap-2">
            WhatsApp ile Onayla
          </a>
          <Link href="/" className="inline-block w-full px-10 py-4 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-all">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
