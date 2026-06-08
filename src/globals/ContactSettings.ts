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
      defaultValue: '+90 216 425 61 14',
    },
    {
      name: 'email',
      type: 'text',
      label: 'E-Posta Adresi',
      defaultValue: 'info@dilim.com.tr',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp Hattı (Aynıysa kopyalayın)',
      defaultValue: '+90 216 425 61 14',
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram Linki',
      defaultValue: 'https://www.instagram.com/bi_dilimpasta/',
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook Linki',
      defaultValue: 'https://www.facebook.com/dilimpastaneleri/',
    },
    {
      name: 'twitter',
      type: 'text',
      label: 'X (Twitter) Linki',
      defaultValue: 'https://x.com/dilimpastanesi',
    },
  ],
}
