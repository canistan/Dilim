import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Teslimat Koşulları | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri siparişlerinizin teslimat koşulları ve bölgeleri hakkında detaylı bilgi.',
}

export default function TeslimatKosullariPage() {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-dilim-portakal transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-dilim-siyah">Teslimat Koşulları</span>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-8">
            Teslimat Koşulları
          </h1>
          <div className="h-1 w-20 bg-dilim-yaldiz mb-12"></div>
          
          <div className="prose prose-lg prose-gray max-w-none text-gray-600 font-light">
            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">1. Teslimat Bölgelerimiz</h3>
            <p>
              Ürünlerimizin tazeliğini ve formunu korumak birincil önceliğimizdir. Bu sebeple sadece <strong>İstanbul içi</strong> belirli ilçelere özel soğutmalı araçlarımız ve kuryelerimizle teslimat hizmeti sunmaktayız. Kargoyla (Yurtiçi, Aras vb.) pasta gönderimi <u>yapılmamaktadır.</u>
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Ücretsiz Teslimat Bölgesi:</strong> Beykoz, Kavacık, Ümraniye (Belirli mahalleler)</li>
              <li><strong>Ücretli Teslimat Bölgeleri:</strong> İstanbul Anadolu ve Avrupa yakasındaki diğer tüm ilçeler (Uzaklık KM bazlı ücretlendirilir).</li>
            </ul>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">2. Teslimat Saatleri</h3>
            <p>
              Siparişleriniz sırasında tercih ettiğiniz teslimat tarih ve saat aralığında (Örn: 14:00 - 16:00) adresinize ulaştırılmaktadır. Trafik yoğunluğu veya olağanüstü durumlarda oluşabilecek kısa gecikmelerde operasyon ekibimiz sizi önceden bilgilendirecektir.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">3. Teslimat Sırasında Dikkat Edilmesi Gerekenler</h3>
            <p>
              Siparişinizi kuryemizden teslim alırken ürünün durumunu kontrol etmenizi rica ederiz. Üründe taşıma kaynaklı bir hasar olması durumunda kuryemizle birlikte tutanak tutularak anında telafisi veya iadesi gerçekleştirilecektir. Teslim alındıktan sonra oluşabilecek form bozukluklarından firmamız sorumlu tutulamaz.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">4. Alıcının Adreste Bulunamaması</h3>
            <p>
              Kuryemiz belirtilen adrese ulaştığında size veya belirttiğiniz alıcıya ulaşamazsa, siparişiniz güvenliği açısından geri merkez şubemize getirilir. Bu durumda ikinci bir teslimat talebi ek ücrete tabi olacaktır.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
