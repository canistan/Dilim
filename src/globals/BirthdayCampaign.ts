import type { GlobalConfig } from 'payload'

export const BirthdayCampaign: GlobalConfig = {
  slug: 'birthday-campaign',
  label: 'Doğum Günü Ayarları',
  admin: {
    group: 'Site Yönetimi',
    hidden: true,
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
  ],
}
