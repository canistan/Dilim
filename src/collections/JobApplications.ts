import type { CollectionConfig } from 'payload'
import { sendNotificationEmail } from '../lib/hooks/sendNotificationEmail'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: {
    singular: 'Kariyer Başvurusu',
    plural: 'Kariyer Başvuruları',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Kullanıcı Bilgi Deposu',
    defaultColumns: ['name', 'position', 'phone', 'createdAt'],
  },
  access: {
    create: () => true, // Herkes form doldurabilir
    read: ({ req: { user } }) => Boolean(user), // Sadece admin okuyabilir
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      sendNotificationEmail('Kariyer Başvurusu')
    ]
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Başvuru Bilgileri',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Ad Soyad',
                  admin: { readOnly: true }
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  label: 'Telefon Numarası',
                  admin: { readOnly: true }
                },
              ]
            },
            {
              name: 'position',
              type: 'select',
              required: true,
              label: 'Başvurulan Pozisyon',
              admin: { readOnly: true },
              options: [
                { label: 'Servis Elemanı (Garson)', value: 'Servis Elemanı (Garson)' },
                { label: 'Barista', value: 'Barista' },
                { label: 'Tezgah Satış Temsilcisi', value: 'Tezgah Satış Temsilcisi' },
                { label: 'Mutfak / İmalat Personeli', value: 'Mutfak / İmalat Personeli' },
                { label: 'Kurye', value: 'Kurye' },
                { label: 'Genel Başvuru (Diğer)', value: 'Genel Başvuru (Diğer)' },
              ],
            },
          ]
        },
        {
          label: 'Tecrübe ve Özgeçmiş',
          fields: [
            {
              name: 'experience',
              type: 'textarea',
              required: true,
              label: 'İş Tecrübesi ve Kapak Yazısı',
              admin: { readOnly: true }
            },
            {
              name: 'resume',
              type: 'upload',
              relationTo: 'resumes',
              label: 'CV / Özgeçmiş Dosyası',
              admin: { readOnly: true }
            },
          ]
        }
      ]
    }
  ],
}
