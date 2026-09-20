import re
import os

filepath = "/Users/canalbayrak/Desktop/c/Siteler/Dilim/src/components/CakeBuilder.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. STEPS'i degistir
steps_regex = r"const STEPS = \[.*?\]"
new_steps = """const STEPS = [
  { id: 1, title: 'Krema Çeşidi', icon: PaintBucket },
  { id: 2, title: 'Kek Çeşidi', icon: CakeSlice },
  { id: 3, title: 'İçerik Çeşitleri', icon: Layers },
  { id: 4, title: 'Yapı ve Şekil', icon: Layers },
  { id: 5, title: 'Kişi Sayısı', icon: User },
  { id: 6, title: 'İletişim & Teslimat', icon: MapPin },
  { id: 7, title: 'Özel Notlar', icon: ChefHat },
]"""
content = re.sub(steps_regex, new_steps, content, flags=re.DOTALL)

# 2. DEFAULT_OPTIONS'u degistir
opts_regex = r"const DEFAULT_OPTIONS = \{.*?\n\}"
new_opts = """const DEFAULT_OPTIONS = {
  krema: [
    { id: 'Çikolata Kremalı', name: 'Çikolata Kremalı', desc: 'Yoğun çikolata lezzeti' },
    { id: 'Beyaz Kremalı', name: 'Beyaz Kremalı', desc: 'Hafif ve sade' },
    { id: 'Akışkan Kremalı', name: 'Akışkan Kremalı', desc: 'Taze ve akışkan doku' },
  ],
  kek: [
    { id: 'Çikolatalı Kek', name: 'Çikolatalı Kek', desc: 'Klasik kakaolu' },
    { id: 'Beyaz Kek', name: 'Beyaz Kek', desc: 'Sade sünger kek' },
  ],
  icerik: [
    { id: 'Çilekli', name: 'Çilekli' },
    { id: 'Muzlu', name: 'Muzlu' },
    { id: 'Karışık Meyveli', name: 'Karışık Meyveli' },
    { id: 'Profiterollü', name: 'Profiterollü' },
    { id: 'Fıstıklı', name: 'Fıstıklı' },
    { id: 'Parça Çikolatalı', name: 'Parça Çikolatalı' },
    { id: 'Frambuazlı', name: 'Frambuazlı' },
    { id: 'Böğürtlenli', name: 'Böğürtlenli' },
    { id: 'Krokanlı', name: 'Krokanlı' },
    { id: 'Kestaneli', name: 'Kestaneli' },
    { id: 'Orman Meyveli', name: 'Orman Meyveli' },
    { id: 'Oreolu', name: 'Oreolu' },
    { id: 'Lotus Bisküvili', name: 'Lotus Bisküvili' },
  ],
  pat: [
    { id: 'Standart Pat', name: 'Standart Pat' },
    { id: 'Yüksek Pat', name: 'Yüksek Pat' },
  ],
  sekil: [
    { id: 'Yuvarlak', name: 'Yuvarlak (Standart)' },
    { id: 'Kare', name: 'Kare' },
    { id: 'Kalp', name: 'Kalp' },
    { id: 'Diğer', name: 'Diğer (Notlarda belirtin)' },
  ],
  kisi: [
    { id: '10 Kişilik', name: '10 Kişilik' },
    { id: '15 Kişilik', name: '15 Kişilik' },
    { id: '20 Kişilik', name: '20 Kişilik' },
    { id: '25 Kişilik', name: '25 Kişilik' },
    { id: '30 Kişilik ve Üzeri', name: '30 Kişilik ve Üzeri (Notlarda belirtin)' },
  ]
}"""
content = re.sub(opts_regex, new_opts, content, flags=re.DOTALL)

# 3. OPTIONS nesnesi mapini guncelle
options_regex = r"const OPTIONS = \{.*?\n    \}\) \: DEFAULT_OPTIONS\.frosting,\n  \}"
new_options_obj = """const OPTIONS = DEFAULT_OPTIONS;"""
content = re.sub(options_regex, new_options_obj, content, flags=re.DOTALL)

# 4. State type ve baslangic state'i
state_regex = r"const \[selections, setSelections\] = useState<\s*\{\s*size.*?\s*\}\s*>\(\{(.*?)\}\)"
new_state = """const [selections, setSelections] = useState<{
    krema: string; kek: string; icerik: string[]; pat: string; sekil: string; kisi: string;
    note: string; customerName: string; customerPhone: string; customerEmail: string;
    customerAddress: string; requestedDate: string; timeSlot: string; referenceImage: File | null;
  }>({
    krema: '', kek: '', icerik: [], pat: '', sekil: '', kisi: '',
    note: '', customerName: '', customerPhone: '', customerEmail: '',
    customerAddress: '', requestedDate: '', timeSlot: '', referenceImage: null
  })
  
  const handleToggleIcerik = (id: string) => {
    setSelections(prev => {
      const exists = prev.icerik.includes(id);
      if (exists) {
        return { ...prev, icerik: prev.icerik.filter(item => item !== id) }
      } else {
        if (prev.icerik.length >= 3) {
          toast.error("En fazla 3 içerik seçebilirsiniz.");
          return prev;
        }
        return { ...prev, icerik: [...prev.icerik, id] }
      }
    })
  }"""
content = re.sub(state_regex, new_state, content, flags=re.DOTALL)

# 5. isStepValid guncelle
valid_regex = r"const isStepValid = \(\) => \{.*?case 5: return true;.*?return true;\n    \}"
new_valid = """const isStepValid = () => {
    switch (currentStep) {
      case 1: return selections.krema !== '';
      case 2: return selections.kek !== '';
      case 3: return selections.icerik.length > 0 && selections.icerik.length <= 3;
      case 4: return selections.pat !== '' && selections.sekil !== '';
      case 5: return selections.kisi !== '';
      case 6: return selections.customerName !== '' && selections.customerPhone !== '' && selections.customerAddress !== '' && selections.requestedDate !== '' && selections.timeSlot !== '';
      case 7: return true;
      default: return true;
    }
  }"""
content = re.sub(valid_regex, new_valid, content, flags=re.DOTALL)

# 6. formData kismini degistir
form_regex = r"formData\.append\('size', selections\.size\).*?if \(selections\.referenceImage\) \{"
new_form = """formData.append('size', selections.kisi)
      formData.append('base', selections.kek)
      formData.append('filling', selections.icerik.join(', '))
      formData.append('frosting', selections.krema)
      const fullNote = `Pat Sayısı: ${selections.pat} | Şekil: ${selections.sekil}\\nÖzel Not: ${selections.note}`
      formData.append('note', fullNote)
      formData.append('requestedDate', selections.requestedDate)
      formData.append('timeSlot', selections.timeSlot)
      if (selections.referenceImage) {"""
content = re.sub(form_regex, new_form, content, flags=re.DOTALL)

# 7. Whatsapp mesajini degistir
wa_regex = r"const sizeName = OPTIONS\.size.*?\n\s*const rawMessage =.*?Fiyat teklifinizi ve onayınızı bekliyorum\.\`;"
new_wa = """const rawMessage = `Merhaba, web siteniz üzerinden özel bir pasta tasarımı gönderdim (Talep No: ${data.id}).

👤 *İletişim Bilgilerim*
- *Ad Soyad:* ${selections.customerName}
- *Adres:* ${selections.customerAddress}
- *İstenen Teslimat:* ${selections.requestedDate} (${selections.timeSlot})

🎂 *Tasarım Özeti*
- *Kişi Sayısı:* ${selections.kisi}
- *Krema:* ${selections.krema}
- *Kek:* ${selections.kek}
- *İçerikler:* ${selections.icerik.join(', ')}
- *Yapı & Şekil:* ${selections.pat}, ${selections.sekil}
- *Özel Not:* ${selections.note || 'Yok'}
${mediaUrlStr ? `\\n📎 *Referans Görselim:* ${mediaUrlStr}\\n` : ''}
Fiyat teklifinizi ve onayınızı bekliyorum.\`;"""
content = re.sub(wa_regex, new_wa, content, flags=re.DOTALL)


# 8. Render kismini degistir (Zor kisim - hardcode degistirelim)
# Step 1,2,3... diye switch yazalim
render_regex = r"const renderStepContent = \(\) => \{.*?\} \/\* End renderStepContent \*\/"
new_render = """const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {OPTIONS.krema.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('krema', opt.id)} className={`relative group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${selections.krema === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}>
                {selections.krema === opt.id && <div className="absolute top-4 right-4 w-6 h-6 bg-dilim-portakal rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                <div className="mt-4">
                  <h3 className="font-bold text-lg text-dilim-siyah mb-2 group-hover:text-dilim-portakal transition-colors">{opt.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {OPTIONS.kek.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('kek', opt.id)} className={`relative group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${selections.kek === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}>
                {selections.kek === opt.id && <div className="absolute top-4 right-4 w-6 h-6 bg-dilim-portakal rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                <div className="mt-4">
                  <h3 className="font-bold text-lg text-dilim-siyah mb-2 group-hover:text-dilim-portakal transition-colors">{opt.name}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <p className="mb-4 text-gray-500">Lütfen en az 1, en fazla 3 içerik seçiniz.</p>
            <div className="flex flex-wrap gap-3">
              {OPTIONS.icerik.map((opt) => {
                const isSelected = selections.icerik.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => handleToggleIcerik(opt.id)} className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${isSelected ? 'border-dilim-portakal bg-dilim-portakal text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-dilim-portakal hover:text-dilim-portakal'}`}>
                    {isSelected && <Check className="w-4 h-4 inline-block mr-1" />}
                    {opt.name}
                  </button>
                )
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Pat Sayısı (Katman)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OPTIONS.pat.map((opt) => (
                  <div key={opt.id} onClick={() => handleSelect('pat', opt.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selections.pat === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}>
                    {opt.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Pasta Şekli</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {OPTIONS.sekil.map((opt) => (
                  <div key={opt.id} onClick={() => handleSelect('sekil', opt.id)} className={`p-4 text-center rounded-xl border-2 cursor-pointer transition-all ${selections.sekil === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}>
                    {opt.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {OPTIONS.kisi.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('kisi', opt.id)} className={`relative group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${selections.kisi === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}>
                {selections.kisi === opt.id && <div className="absolute top-4 right-4 w-6 h-6 bg-dilim-portakal rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                <div className="mt-4">
                  <h3 className="font-bold text-lg text-dilim-siyah group-hover:text-dilim-portakal transition-colors">{opt.name}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-dilim-siyah border-b pb-2">Kişisel Bilgiler</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad <span className="text-red-500">*</span></label>
                  <input type="text" value={selections.customerName} onChange={(e) => handleSelect('customerName', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50" placeholder="Örn: Ayşe Yılmaz" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-red-500">*</span></label>
                    <input type="tel" value={selections.customerPhone} onChange={(e) => handleSelect('customerPhone', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input type="email" value={selections.customerEmail} onChange={(e) => handleSelect('customerEmail', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50" placeholder="Opsiyonel" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Adresi <span className="text-red-500">*</span></label>
                  <textarea value={selections.customerAddress} onChange={(e) => handleSelect('customerAddress', e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50 resize-none" placeholder="Açık adresinizi giriniz..."></textarea>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-dilim-siyah border-b pb-2">Teslimat Zamanı</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Tarihi <span className="text-red-500">*</span></label>
                  <input type="date" min={getMinDate()} value={selections.requestedDate} onChange={(e) => handleDateChange(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  <p className="text-xs text-gray-400 mt-1">Hafta sonları (Cumartesi ve Pazar) özel sipariş alamıyoruz.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Saati <span className="text-red-500">*</span></label>
                  <select value={selections.timeSlot} onChange={(e) => handleSelect('timeSlot', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-white">
                    <option value="" disabled>Saat Aralığı Seçin</option>
                    {getFilteredTimeSlots().map((slot) => (
                      <option key={slot.id} value={slot.timeRange}>{slot.timeRange}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-dilim-siyah mb-6">Özel İstekleriniz ve Görsel (Opsiyonel)</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tasarım İçin Referans Görsel (Varsa)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PaintBucket className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Resim yüklemek için tıklayın</span> veya sürükleyin</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (Maks. 5MB)</p>
                      {selections.referenceImage && (
                        <p className="mt-2 text-sm text-dilim-portakal font-medium">Seçilen Dosya: {selections.referenceImage.name}</p>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eklemek İstediğiniz Notlar</label>
                <textarea value={selections.note} onChange={(e) => handleSelect('note', e.target.value)} rows={4} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none" placeholder="Pastanın üzerine yazılacak yazı, renk tercihleri vb. özel isteklerinizi buraya yazabilirsiniz..."></textarea>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  } /* End renderStepContent */"""

# Dosyada bir sorun olmamasi icin once mevcut renderStepContent bitisini bulup degistirelim.
content = re.sub(r"const renderStepContent = \(\) => \{.*?\} \/\* End renderStepContent \*\/\n?", new_render + "\n", content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")
