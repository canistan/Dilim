import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="bg-dilim-bordo text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="text-4xl font-extrabold tracking-tighter text-white mb-6 block">
            <span className="text-dilim-portakal">D</span>ilim
          </span>
          <p className="text-sm text-gray-200 mt-4 leading-relaxed">
            Özel anlarınıza lezzet katıyoruz. Her gün yenilenen ve daimi olmasını talep ettiğimiz müşterilerimizin özel ve mutlu günlerine ortak olduğumuz anlardan ibaret olan kocaman bir birikimden oluşmaktayız.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6 text-dilim-yaldiz">Hızlı Linkler</h4>
          <ul className="space-y-3 text-sm text-gray-200">
            <li><Link href="/kurumsal" className="hover:text-dilim-portakal transition-colors">Kurumsal</Link></li>
            <li><Link href="/urunler" className="hover:text-dilim-portakal transition-colors">Ürünlerimiz</Link></li>
            <li><Link href="/tasarla" className="hover:text-dilim-portakal transition-colors">Kendi Pastanı Tasarla</Link></li>
            <li><Link href="/iletisim" className="hover:text-dilim-portakal transition-colors">İletişim</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6 text-dilim-yaldiz">Şubelerimiz</h4>
          <ul className="space-y-3 text-sm text-gray-200">
            <li>Kavacık Merkez</li>
            <li>Ümraniye Şubesi</li>
            <li>Alemdağ Şubesi</li>
            <li>Beykoz Şubesi</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6 text-dilim-yaldiz">İletişim</h4>
          <ul className="space-y-3 text-sm text-gray-200">
            <li>Rüzgarlıbahçe Mah. Cumhuriyet Cad. Acarlar İş Merkezi Beykoz/İstanbul</li>
            <li>+90 216 425 61 14</li>
            <li>info@dilim.com.tr</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/20 text-center text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Dilim Pastaneleri. Tüm Hakları Saklıdır.
      </div>
    </footer>
  )
}
