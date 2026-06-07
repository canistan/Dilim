import type { CollectionConfig } from 'payload'

export const CustomCakes: CollectionConfig = {
  slug: 'custom-cakes',
  labels: {
    singular: 'Tasarım Seçeneği',
    plural: 'Kendi Pastanı Tasarla',
  },
  admin: {
    useAsTitle: 'customerName',
    group: 'Site Yönetimi',
    defaultColumns: ['customerName', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      label: 'Talep Durumu',
      options: [
        { label: 'Bekliyor', value: 'pending' },
        { label: 'Fiyat Verildi', value: 'fiyat_verildi' },
        { label: 'Onaylandı', value: 'onaylandi' },
        { label: 'Reddedildi', value: 'reddedildi' },
      ],
      admin: {
        position: 'sidebar',
        components: {
          Cell: '@/components/Admin/StatusCell#StatusCell',
        },
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Müşteri Ad Soyad',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
      label: 'Telefon',
    },
    {
      name: 'customerEmail',
      type: 'text',
      label: 'E-posta',
    },
    {
      name: 'customerAddress',
      type: 'textarea',
      required: true,
      label: 'Adres',
    },
    {
      name: 'cakeSize',
      type: 'number',
      required: true,
      label: 'Kişi Sayısı',
    },
    {
      name: 'spongeType',
      type: 'select',
      required: true,
      label: 'Kek Tipi',
      options: [
        { label: 'Sade', value: 'sade' },
        { label: 'Kakaolu', value: 'kakaolu' },
      ],
    },
    {
      name: 'creamFlavor',
      type: 'select',
      required: true,
      label: 'Krema Aroması',
      options: [
        { label: 'Çikolatalı', value: 'cikolata' },
        { label: 'Vanilyalı', value: 'vanilya' },
        { label: 'Meyveli', value: 'meyveli' },
      ],
    },
    {
      name: 'extraIngredients',
      type: 'select',
      hasMany: true,
      label: 'Ekstra Malzemeler',
      options: [
        { label: 'Fıstık', value: 'fistik' },
        { label: 'Ceviz', value: 'ceviz' },
        { label: 'Damla Çikolata', value: 'damla-cikolata' },
      ],
    },
    {
      name: 'referenceImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Örnek Görsel',
    },
  ],
}
