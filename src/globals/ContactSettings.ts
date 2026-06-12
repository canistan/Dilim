import type { GlobalConfig } from 'payload'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'İletişim Bilgileri',
  admin: {
    group: 'Site Yönetimi',
    description: 'Sitedeki tüm iletişim, adres ve sosyal medya bilgilerini buradan değiştirebilirsiniz.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'address',
      type: 'textarea',
      label: 'Açık Adres',
      defaultValue: 'Rüzgarlıbahçe Mah. Cumhuriyet Cad. Acarlar İş Merkezi Beykoz/İstanbul',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon Numarası',
      defaultValue: '+90 505 963 80 21',
    },
    {
      name: 'email',
      type: 'text',
      label: 'E-Posta Adresi',
      defaultValue: 'info@dilim.com.tr',
    },

    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram Linki',
      defaultValue: 'https://www.instagram.com/dilimpastaneleri',
    },
    {
      name: 'tiktok',
      type: 'text',
      label: 'TikTok Linki',
      defaultValue: 'https://www.tiktok.com/@dilimpastaneleri',
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook Linki',
      defaultValue: 'https://www.facebook.com/share/1BQ7yRqh6n/',
    },
    {
      name: 'twitter',
      type: 'text',
      label: 'X (Twitter) Linki',
      defaultValue: 'https://x.com/dilimpastanesi',
    },
  ],
}
