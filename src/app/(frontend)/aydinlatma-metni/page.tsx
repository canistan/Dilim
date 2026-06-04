export default function AydinlatmaMetni() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-serif font-bold text-dilim-siyah mb-8">Aydınlatma Metni</h1>
      <div className="prose max-w-none text-gray-600 space-y-6 bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-gray-100">
        <p><strong>Son Güncelleme:</strong> {new Date().toLocaleDateString()}</p>
        <p>Dilim Pastaneleri olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla kişisel verilerinizin işlenmesi konusunda sizleri aydınlatmak isteriz.</p>
        
        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">1. İşlenen Kişisel Verileriniz</h2>
        <p>Sitemiz üzerinden gerçekleştirdiğiniz üyelik, sipariş ve iletişim süreçlerinde: Kimlik bilgileriniz (ad, soyad), iletişim bilgileriniz (telefon numarası, e-posta adresi), fatura/teslimat adresiniz ve işlem güvenliği verileriniz işlenmektedir.</p>
        
        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">2. Verilerin İşlenme Amacı</h2>
        <p>Kişisel verileriniz;</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Siparişlerinizin alınması, hazırlanması ve adresinize teslim edilmesi,</li>
          <li>Fatura düzenlenmesi ve yasal finansal yükümlülüklerimizin yerine getirilmesi,</li>
          <li>Müşteri destek hizmetlerinin sunulması ve şikayet/taleplerinizin çözülmesi,</li>
          <li>Yetkili kamu kurum ve kuruluşlarına yasal zorunluluklar kapsamında bilgi verilmesi</li>
        </ul>
        <p>amaçlarıyla işlenmektedir.</p>

        <h2 className="text-xl font-bold text-dilim-siyah mt-8 mb-4">3. Kişisel Verilerin Aktarımı</h2>
        <p>Kişisel verileriniz, yasal zorunluluklar çerçevesinde yetkili kamu kurumlarına; siparişlerinizin teslimatı amacıyla anlaşmalı kargo/kurye şirketlerine ve ödeme altyapısının sağlanması amacıyla İyzico gibi BDDK onaylı ödeme kuruluşlarına aktarılmaktadır.</p>
      </div>
    </div>
  )
}
