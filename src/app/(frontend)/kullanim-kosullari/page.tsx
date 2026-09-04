export default function KullanimKosullari() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-serif font-bold text-dilim-siyah mb-8">Kullanım Koşulları</h1>
      <div className="prose max-w-none text-gray-600 space-y-6 bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-gray-100">
        <p><strong>Son Güncelleme:</strong> {new Date().toLocaleDateString()}</p>
        <p>Lütfen sitemizi kullanmadan önce bu 'kullanım koşulları' sözleşmesini dikkatlice okuyunuz.</p>
        
        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">1. Taraflar</h2>
        <p>İşbu Kullanım Koşulları, Dilim Pastaneleri (bundan böyle "Şirket" olarak anılacaktır) ile www.dilim.com.tr web sitesine (bundan böyle "Site" olarak anılacaktır) giriş yapan kullanıcılar arasında akdedilmiştir.</p>
        
        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">2. Sitenin Kullanımı</h2>
        <p>Kullanıcı, Siteyi kullanırken yürürlükteki mevzuata, ahlak kurallarına ve işbu koşullara uymayı kabul eder. Site üzerinden yapılan tüm işlemlerde hukuki ve cezai sorumluluk kullanıcının kendisine aittir.</p>
        
        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">3. Fikri Mülkiyet Hakları</h2>
        <p>Sitede yer alan ünvan, işletme adı, marka, patent, logo, tasarım, bilgi ve yöntem gibi tescilli veya tescilsiz tüm fikri mülkiyet hakları site işleteni ve sahibi firmaya veya belirtilen ilgilisine aittir. İzinsiz kopyalanamaz ve kullanılamaz.</p>
        
        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">4. Sorumluluğun Sınırlandırılması ve Görseller</h2>
        <p>Şirket, Siteye erişilmesi veya Sitenin kullanılması nedeniyle doğabilecek doğrudan ya da dolaylı hiçbir zarardan sorumlu tutulamaz. Ayrıca, site üzerinde yer alan tüm ürün görselleri temsilidir. Ürünler el yapımı olduğundan süsleme, renk, boyut ve meyve dizilimi gibi detaylarda teslim edilen ürün ile sitedeki görsel arasında ufak farklılıklar meydana gelebilir.</p>
      </div>
    </div>
  )
}
