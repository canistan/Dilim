import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri Mesafeli Satış Sözleşmesi',
}

export default function MesafeliSatisPage() {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-dilim-portakal transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-dilim-siyah">Mesafeli Satış Sözleşmesi</span>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-8">
            Mesafeli Satış Sözleşmesi
          </h1>
          <div className="h-1 w-20 bg-dilim-yaldiz mb-12"></div>
          
          <div className="prose prose-lg prose-gray max-w-none text-gray-600 font-light">
            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">MADDE 1: TARAFLAR</h3>
            <p>
              İşbu sözleşme, bir tarafta www.dilim.com.tr internet sitesinin faaliyetlerini yürüten Dilim Pastaneleri (bundan böyle SATICI olarak anılacaktır) ile diğer tarafta internet sitesi üzerinden ürün/hizmet siparişi veren tüketici (bundan böyle ALICI olarak anılacaktır) arasında akdedilmiştir.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">MADDE 2: SÖZLEŞMENİN KONUSU</h3>
            <p>
              İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.dilim.com.tr internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin/hizmetlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">MADDE 3: ÜRÜN VE TESLİMAT BİLGİLERİ</h3>
            <p>
              Malın veya Hizmetin türü, miktarı, cinsi, satış bedeli, ödeme şekli ve teslimat adresi sipariş anında ALICI tarafından beyan edilen bilgilerden oluşmaktadır. Gıda ürünlerinin yapısı gereği (taze, bozulabilir), siparişe özel hazırlanan ürünlerde ve teslimat süresince tazeliğin korunması şartına bağlı olarak teslimat SATICI'nın kendi soğutuculu araçlarıyla yapılmaktadır.
            </p>

            <h3 className="text-2xl font-bold text-dilim-siyah mt-10 mb-4">MADDE 4: CAYMA HAKKI İSTİSNALARI</h3>
            <p>
              Mesafeli Sözleşmeler Yönetmeliği uyarınca, <strong>çabuk bozulabilen veya son kullanma tarihi geçme ihtimali olan (gıda, pasta, tatlı vb.)</strong> ürünler ile ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda özel olarak hazırlanan (örn: isim yazılı, özel tasarım) ürünlerde <strong>cayma hakkı bulunmamaktadır.</strong>
            </p>

            <div className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              <p className="mb-0">
                <strong>Not:</strong> Bu metin taslaktır. Canlı kullanıma geçmeden önce yetkili hukuk müşaviriniz tarafından incelenip şirketinize özel hale getirilmelidir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
