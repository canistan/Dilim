import { CakeWizard } from '@/components/CakeWizard/Stepper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kendi Pastanı Tasarla | Dilim Pastaneleri',
  description: 'Hayalinizdeki pastayı adım adım tasarlayın. Dilim Pastaneleri kalitesiyle kapınıza gelsin.',
}

export default function TasarlaPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-dilim-siyah mb-6">
            Kendi <span className="text-dilim-portakal">Pastanızı</span> Tasarlayın
          </h1>
          <p className="text-lg text-gray-600">
            Basmakalıp klasik pastalardan sıkıldınız mı? Kendinize özgü, hayallerinizdeki pastayı adım adım oluşturun; ustalarımız sizin için hazırlasın.
          </p>
        </div>
        
        <CakeWizard />
      </div>
    </div>
  )
}
