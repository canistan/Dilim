import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function seedMessage() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    await payload.create({
      collection: 'contact-messages',
      data: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@ornek.com',
        phone: '0555 123 4567',
        subject: 'Toplu Pasta Siparişi Hakkında',
        message: 'Merhaba, haftaya yapacağımız şirket etkinliğimiz için 150 kişilik özel tasarım bir pasta yaptırmak istiyoruz. Tasarım konusunda görüşmek için bana ulaşabilir misiniz? Teşekkürler.',
      }
    })

    console.log('Mockup iletişim mesajı başarıyla oluşturuldu.')
    process.exit(0)
  } catch (err) {
    console.error('Mesaj oluşturulurken hata:', err)
    process.exit(1)
  }
}

seedMessage()
