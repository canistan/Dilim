import type { CollectionConfig } from 'payload'

export const Resumes: CollectionConfig = {
  slug: 'resumes',
  labels: {
    singular: 'Özgeçmiş',
    plural: 'Özgeçmişler',
  },
  admin: {
    group: 'Site Yönetimi',
    description: 'Kariyer başvurularında yüklenen CV ve özgeçmiş dosyaları.',
  },
  upload: {
    staticDir: 'public/resumes',
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  access: {
    create: () => true, // Herkes yükleyebilir
    read: ({ req: { user } }) => Boolean(user), // Sadece adminler okuyabilir/indirebilir
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        hidden: true,
      }
    },
  ],
}
