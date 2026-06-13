import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menü | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri dijital menüsü.',
}

export default function FigmaMenuPage() {
  const figmaEmbedUrl = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FIR8eKNvKGTLeWbKiYUVkg4%2FDilim-Pastanesi%3Ftype%3Ddesign%26node-id%3D2222-895%26t%3DWAagkDaKqcfVsuuf-0%26scaling%3Dmin-zoom%26page-id%3D0%253A1%26starting-point-node-id%3D1%253A667'

  return (
    <div className="w-full min-h-[85vh] bg-[#1a1a1a] flex flex-col pt-20">
      <iframe
        src={figmaEmbedUrl}
        allowFullScreen
        className="w-full flex-1 border-none"
        title="Dilim Pastaneleri Menü"
      />
    </div>
  )
}
