import type { GlobalConfig } from 'payload'

export const BirthdayCampaign: GlobalConfig = {
  slug: 'birthday-campaign',
  label: 'Doğum Günü Ayarları',
  admin: {
    group: 'Site Yönetimi',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Doğum Günü Kampanyası Aktif Mi?',
      defaultValue: true,
    },
    {
      name: 'emailSubject',
      type: 'text',
      label: 'E-Posta Konusu',
      defaultValue: 'Doğum Gününüz Kutlu Olsun! Size Özel Bir Hediyemiz Var',
      required: true,
    },
    {
      name: 'emailContent',
      type: 'richText',
      label: 'E-Posta İçeriği',
      required: true,
    },
    {
      name: 'discountCode',
      type: 'text',
      label: 'İndirim Kodu',
      admin: {
        description: 'Müşteriye e-postada gösterilecek indirim kodu (Örn: DOGUMGUNU15)',
      },
    },
  ],
}
