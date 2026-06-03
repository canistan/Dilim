import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ReferencesMarquee } from '@/components/ReferencesMarquee'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <ReferencesMarquee />
      <Footer />
    </>
  )
}
