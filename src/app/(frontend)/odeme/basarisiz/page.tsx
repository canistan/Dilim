import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Metadata } from 'next'
import { IframeBreakout } from '@/components/IframeBreakout'

export const metadata: Metadata = {
  title: 'Ödeme Başarısız | Dilim Pastaneleri',
}

export default async function BasarisizPage(props: { searchParams: Promise<{ reason?: string }> }) {
  const searchParams = await props.searchParams;
  const reason = searchParams.reason;

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center py-20">
      <IframeBreakout />
      <div className="container mx-auto px-4 max-w-xl text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-dilim-siyah mb-4">Ödeme Başarısız!</h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          İşleminiz sırasında bir hata oluştu ve ödemeniz alınamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.
        </p>
        {reason && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-10 border border-red-100">
            <strong>Hata Detayı:</strong> {reason}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/odeme" className="px-8 py-4 bg-dilim-siyah text-white font-bold rounded-full hover:bg-gray-800 transition-all">
            Tekrar Dene
          </Link>
          <Link href="/iletisim" className="px-8 py-4 bg-white text-dilim-siyah border-2 border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-all">
            Destek Al
          </Link>
        </div>
      </div>
    </div>
  )
}
