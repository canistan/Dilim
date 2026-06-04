import type { CollectionConfig } from 'payload'

export const CustomCakes: CollectionConfig = {
  slug: 'custom-cakes',
  labels: {
    singular: 'Tasarım Seçeneği',
    plural: 'Kendi Pastanı Tasarla',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Site Yönetimi',
  },
  fields: [
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
