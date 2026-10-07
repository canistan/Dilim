import QRCode from 'qrcode'
import sharp from 'sharp'
import path from 'path'

async function run() {
  const url = 'https://www.dilim.com.tr/menu'
  const outPath = path.join(process.cwd(), 'public', 'menu_qr.png')
  const logoPath = path.join(process.cwd(), 'public', 'DilimPastLogo.png')
  
  try {
    // Generate QR code with High error correction so the center logo doesn't break it
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      width: 1000,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    
    // Resize the logo to fit nicely in the center (about 25-30% of the QR width)
    const logoBuffer = await sharp(logoPath)
      .resize(300, null, { fit: 'contain' })
      .toBuffer()
      
    // Composite the logo over the QR code
    await sharp(qrBuffer)
      .composite([{ input: logoBuffer, gravity: 'center' }])
      .toFile(outPath)
      
    console.log('QR Code generated successfully at public/menu_qr.png')
  } catch (err) {
    console.error('Error generating QR Code:', err)
  }
}

run()
