import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kariyer ve İş Başvurusu | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri kariyer fırsatları ve iş başvuru formu. Güler yüzlü ekibimizle birlikte büyümek için başvurunuzu yapın.',
  alternates: {
    canonical: 'https://www.dilim.com.tr/kariyer',
  },
}

export default function KariyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
