import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | Dilim Pastaneleri',
  description: 'Teslimat süreleri, özel tasarım yaş pasta siparişleri, içerik bilgileri ve iptal koşulları gibi konularda merak ettiğiniz soruların cevapları.',
}

export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
