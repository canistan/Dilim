import type { CollectionConfig } from 'payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: {
    singular: 'Kariyer Başvurusu',
    plural: 'Kariyer Başvuruları',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Site Yönetimi',
    defaultColumns: ['name', 'position', 'phone', 'createdAt'],
  },
  access: {
    create: () => true, // Herkes form doldurabilir
    read: ({ req: { user } }) => Boolean(user), // Sadece admin okuyabilir
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ad Soyad',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Telefon Numarası',
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      label: 'Başvurulan Pozisyon',
      options: [
        { label: 'Servis Elemanı (Garson)', value: 'garson' },
        { label: 'Barista', value: 'barista' },
        { label: 'Tezgah Satış Temsilcisi', value: 'tezgah' },
        { label: 'Mutfak / İmalat Personeli', value: 'mutfak' },
        { label: 'Kurye', value: 'kurye' },
        { label: 'Genel Başvuru (Diğer)', value: 'genel' },
      ],
    },
    {
      name: 'experience',
      type: 'textarea',
      required: true,
      label: 'İş Tecrübesi',
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'resumes',
      label: 'CV / Özgeçmiş Dosyası',
    },
  ],
}
