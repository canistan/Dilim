import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Gizlilik ve KVKK Politikası | Dilim Pastaneleri',
  description: 'Kişisel Verilerin Korunması ve Gizlilik Politikası',
}

export default function KvkkPage() {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-dilim-portakal transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-dilim-siyah">Gizlilik ve KVKK</span>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-8">
            Gizlilik ve Kişisel Verilerin Korunması Politikası
          </h1>
          <div className="h-1 w-20 bg-dilim-yaldiz mb-12"></div>
          
          <div className="prose prose-lg prose-gray max-w-none text-gray-600 font-light">
            <p>
              <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
            </p>
            
            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">1. Giriş</h3>
            <p>
              Dilim Pastaneleri olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, sizlere sunduğumuz hizmetler kapsamında kişisel verilerinizin işlenme amaçları, hukuki nedenleri, toplanma yöntemleri ve haklarınız konusunda sizleri bilgilendirmek isteriz.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">2. Hangi Verilerinizi İşliyoruz?</h3>
            <p>
              Web sitemizi ziyaretiniz, üyelik işlemleriniz ve ürün siparişleriniz sırasında aşağıdaki kişisel verilerinizi toplamaktayız:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad.</li>
              <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi, fatura ve teslimat adresleri.</li>
              <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, site içi gezinme bilgileri (çerezler).</li>
            </ul>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">3. Kişisel Verilerinizin İşlenme Amaçları</h3>
            <p>
              Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Siparişlerinizin alınması, hazırlanması ve teslimat süreçlerinin yürütülmesi,</li>
              <li>Fatura süreçlerinin yönetimi,</li>
              <li>Müşteri memnuniyetine yönelik destek hizmetlerinin sağlanması,</li>
              <li>Açık rızanız olması halinde kampanya, indirim ve yeniliklerden sizleri haberdar etmek.</li>
            </ul>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">4. Haklarınız</h3>
            <p>
              KVKK'nın 11. maddesi uyarınca veri sahibi olarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini talep etme haklarına sahipsiniz. Haklarınızı kullanmak için <strong>info@dilim.com.tr</strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
            </p>

            <div className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              <p className="mb-0">
                <strong>Not:</strong> Bu metin standart bir bilgilendirme taslağıdır. Resmi işlemleriniz için lütfen hukuk danışmanınızla görüşerek kurumunuza özel metinler hazırlatınız.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
