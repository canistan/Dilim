import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menü | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri dijital menüsü.',
}

export default function FigmaMenuPage() {
  const figmaEmbedUrl =
    'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FIR8eKNvKGTLeWbKiYUVkg4%2FDilim-Pastanesi%3Ftype%3Ddesign%26node-id%3D2222-895%26t%3DWAagkDaKqcfVsuuf-0%26scaling%3Dmin-zoom%26page-id%3D0%253A1%26starting-point-node-id%3D1%253A667'

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
      }}
    >
      <iframe
        src={figmaEmbedUrl}
        allowFullScreen
        style={{ border: 'none', width: '100%', height: '100%' }}
        title="Dilim Pastaneleri Menü"
      />
    </div>
  )
}
