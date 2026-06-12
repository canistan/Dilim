import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Müşteri',
    plural: 'Müşteriler',
  },
  admin: {
    useAsTitle: 'name', // email is default for auth collections but let's use name or email
    group: 'Kullanıcı Bilgi Deposu',
    defaultColumns: ['name', 'email', 'birthDate', 'provider', 'createdAt'],
  },
  access: {
    admin: () => false, // Müşterilerin admin paneline girmesi kesin olarak engellendi
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes in ms
    // Disable password requirement for social login users if possible, or handle it by generating a random password
    // Actually Payload 3.0 auth requires password if using local strategy. 
    // We will generate a secure random password for OAuth users on creation.
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profil Bilgileri',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Ad' },
            { name: 'surname', type: 'text', required: false, label: 'Soyad' },
            { 
              name: 'gender', 
              type: 'select', 
              options: [
                { label: 'Kadın', value: 'female' },
                { label: 'Erkek', value: 'male' },
                { label: 'Belirtmek İstemiyorum', value: 'other' },
              ],
              label: 'Cinsiyet',
            },
            {
              name: 'birthDate',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' } },
              label: 'Doğum Tarihi',
            },
            { name: 'phone', type: 'text', label: 'Telefon Numarası' },
            {
              name: 'provider',
              type: 'select',
              options: [
                { label: 'Google', value: 'google' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'E-Posta', value: 'credentials' },
              ],
              defaultValue: 'credentials',
              admin: { position: 'sidebar' },
              label: 'Kayıt Yöntemi',
            },
            {
              name: 'providerAccountId',
              type: 'text',
              admin: { position: 'sidebar', readOnly: true },
              label: 'Sosyal ID',
            },
          ]
        },
        {
          label: 'Adresler',
          fields: [
            {
              name: 'addresses',
              type: 'array',
              label: 'Kayıtlı Adresler',
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Adres Başlığı (Ev, İş vb.)' },
                { name: 'district', type: 'text', required: true, label: 'İlçe' },
                { name: 'address', type: 'textarea', required: true, label: 'Açık Adres' },
                { name: 'isCorporate', type: 'checkbox', defaultValue: false, label: 'Kurumsal Fatura' },
                { 
                  name: 'companyName', 
                  type: 'text', 
                  label: 'Firma Adı',
                  admin: { condition: (data, siblingData) => Boolean(siblingData?.isCorporate) }
                },
                { 
                  name: 'taxOffice', 
                  type: 'text', 
                  label: 'Vergi Dairesi',
                  admin: { condition: (data, siblingData) => Boolean(siblingData?.isCorporate) }
                },
                { 
                  name: 'taxNumber', 
                  type: 'text', 
                  label: 'Vergi Numarası',
                  admin: { condition: (data, siblingData) => Boolean(siblingData?.isCorporate) }
                },
              ],
            },
          ]
        },
        {
          label: 'Geçmiş Siparişler',
          fields: [
            {
              name: 'pastOrders',
              type: 'join',
              collection: 'orders',
              on: 'customer',
              label: 'Bu Müşterinin Tüm Siparişleri',
            }
          ]
        }
      ]
    }
  ],
}
