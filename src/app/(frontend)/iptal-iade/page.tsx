import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'İptal ve İade Koşulları | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri İptal ve İade Koşulları',
}

export default function IptalIadePage() {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-dilim-portakal transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-dilim-siyah">İptal ve İade</span>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-8">
            İptal ve İade Koşulları
          </h1>
          <div className="h-1 w-20 bg-dilim-yaldiz mb-12"></div>
          
          <div className="prose prose-lg prose-gray max-w-none text-gray-600 font-light">
            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">1. İptal Koşulları</h3>
            <p>
              Siparişleriniz gıda ve taze tüketim ürünleri olduğu için üretime başlanmadan önce iptal edilebilir. Sipariş iptali için teslimat gününden <strong>en az 24 saat önce</strong> 0505 963 80 21 numaralı müşteri hizmetleri hattımızı arayarak bilgi vermeniz gerekmektedir. Üretim sürecine girmiş olan pasta ve tatlı siparişlerinde maalesef iptal işlemi gerçekleştirilememektedir.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">2. İade Koşulları</h3>
            <p>
              Mesafeli Sözleşmeler Yönetmeliği uyarınca, <strong>çabuk bozulabilen, son kullanma tarihi geçme ihtimali olan taze gıda ürünlerinde cayma hakkı ve iade yasal olarak bulunmamaktadır.</strong>
            </p>
            <p>
              Ancak müşteri memnuniyeti odaklı hizmet anlayışımız gereği aşağıdaki olağanüstü durumlarda iade veya ürün değişimi tarafımızca sağlanmaktadır:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Teslimat esnasında ürünün zarar görmüş, formunun bozulmuş olması,</li>
              <li>Sipariş ettiğiniz üründen tamamen farklı veya eksik bir ürün teslim edilmesi,</li>
              <li>Tazelik veya lezzet standartlarımızla bağdaşmayan kusurlu bir üretim hatasının tespit edilmesi.</li>
            </ul>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">3. Teslimat Anında Kontrol</h3>
            <p>
              Lütfen siparişiniz teslim edilirken ürününüzü kontrol ediniz. Herhangi bir hasar veya hata durumunda teslimat personeline durumu bildirerek tutanak tutturabilir veya ürünü teslim almayı reddedebilirsiniz. Teslim alındıktan sonra, gıda güvenliği ve hijyen kuralları gereği iade kabul edilememektedir.
            </p>

            <div className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              <p className="mb-0">
                <strong>Not:</strong> Bu metin taslaktır. Canlı kullanıma geçmeden önce şirketinizin operasyon ve iade prosedürlerine göre avukatınızca düzenlenmelidir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
