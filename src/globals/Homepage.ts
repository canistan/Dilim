import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Anasayfa Ayarları',
  admin: {
    group: 'Site Yönetimi',
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Ana Başlık',
      defaultValue: 'Özel Anlarınıza Tatlı Bir Dokunuş',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Alt Başlık',
      defaultValue: 'Özel günleriniz ve tatlı krizleriniz için özenle hazırlanan günlük pastalarımızı keşfedin. Kendi pastanızı tasarlayın veya menümüzden seçin.',
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products' as any,
      hasMany: true,
      label: 'Öne Çıkan Ürünler',
    },
  ],
}
