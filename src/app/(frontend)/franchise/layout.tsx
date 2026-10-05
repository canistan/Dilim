import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Franchise Başvurusu | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri franchise başvuru formu. Yılların getirdiği ustalık ve marka güvencesiyle kârlı bir işletmeye sahip olun.',
}

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
