import type { GlobalConfig } from 'payload'

export const CustomCakeOptions: GlobalConfig = {
  slug: 'custom-cake-options',
  label: 'Kendi Pastanı Tasarla',
  admin: {
    group: 'Site Yönetimi',
    description: 'Kendi pastanı tasarla sayfasındaki dinamik seçenekleri (Kek türü, porsiyon vb.) buradan yönetebilirsiniz.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      label: 'Sayfa Başlığı',
      defaultValue: 'Hayalindeki Pastayı Tasarla',
    },
    {
      name: 'pageDescription',
      type: 'textarea',
      label: 'Sayfa Açıklaması',
      defaultValue: 'Özel günleriniz için tamamen size özel, butik tasarım pastanızı oluşturun.',
    },
    {
      name: 'spongeOptions',
      type: 'array',
      label: 'Kek Türü Seçenekleri',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Seçenek Adı (Örn: Vanilyalı)' },
        { name: 'priceImpact', type: 'number', defaultValue: 0, label: 'Fiyat Etkisi (+TL)' },
      ],
    },
    {
      name: 'creamOptions',
      type: 'array',
      label: 'Krema Türü Seçenekleri',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Seçenek Adı (Örn: Çikolatalı)' },
        { name: 'priceImpact', type: 'number', defaultValue: 0, label: 'Fiyat Etkisi (+TL)' },
      ],
    },
    {
      name: 'portionOptions',
      type: 'array',
      label: 'Porsiyon Seçenekleri',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Seçenek Adı (Örn: 10 Kişilik)' },
        { name: 'basePrice', type: 'number', required: true, label: 'Taban Fiyat (TL)' },
      ],
    },
  ],
}
