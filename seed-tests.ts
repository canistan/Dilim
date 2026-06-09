import fs from 'fs';
const envContent = fs.readFileSync('.env', 'utf-8');
const secretMatch = envContent.match(/PAYLOAD_SECRET="?([^"\n]+)"?/);
const uriMatch = envContent.match(/DATABASE_URI="?([^"\n]+)"?/);
if (secretMatch) process.env.PAYLOAD_SECRET = secretMatch[1];
if (uriMatch) process.env.DATABASE_URI = uriMatch[1];
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })

  // Find some products
  const products = await payload.find({ collection: 'products', limit: 2 })
  if (products.docs.length === 0) {
    console.error("No products found to create orders.")
    return
  }
  const product1 = products.docs[0].id
  const product2 = products.docs[1] ? products.docs[1].id : product1

  // 1. TAMAMLANDI SENARYOSU
  console.log("1. Tamamlandı senaryosu oluşturuluyor...")
  const customer1 = await payload.create({
    collection: 'customers',
    data: {
      email: 'ali.yilmaz@example.com',
      password: 'TestPassword123!',
      name: 'Ali',
      surname: 'Yılmaz',
      phone: '05551112233',
      birthDate: '1990-05-15T00:00:00.000Z',
      gender: 'male',
      addresses: [{ title: 'Ev', district: 'Kadıköy', address: 'Moda Cad. No:1' }]
    }
  })

  const order1 = await payload.create({
    collection: 'orders',
    data: {
      orderType: 'standard',
      totalAmount: 1500,
      status: 'delivered',
      paymentStatus: 'paid',
      customerInfo: {
        firstName: 'Ali',
        lastName: 'Yılmaz',
        email: 'ali.yilmaz@example.com',
        phone: '05551112233',
        district: 'Kadıköy',
        address: 'Moda Cad. No:1'
      },
      orderItems: [
        { product: product1, quantity: 2, price: 500 },
        { product: product2, quantity: 1, price: 500 }
      ]
    }
  })

  // 2. İPTAL SENARYOSU
  console.log("2. İptal senaryosu oluşturuluyor...")
  const customer2 = await payload.create({
    collection: 'customers',
    data: {
      email: 'ayse.demir@example.com',
      password: 'TestPassword123!',
      name: 'Ayşe',
      surname: 'Demir',
      phone: '05552223344',
      birthDate: '1992-08-22T00:00:00.000Z',
      gender: 'female',
      addresses: [{ title: 'İş', district: 'Şişli', address: 'Büyükdere Cad. No:10' }]
    }
  })

  const order2 = await payload.create({
    collection: 'orders',
    data: {
      orderType: 'standard',
      totalAmount: 800,
      status: 'cancelled',
      paymentStatus: 'failed',
      customerInfo: {
        firstName: 'Ayşe',
        lastName: 'Demir',
        email: 'ayse.demir@example.com',
        phone: '05552223344',
        district: 'Şişli',
        address: 'Büyükdere Cad. No:10'
      },
      orderItems: [
        { product: product1, quantity: 1, price: 800 }
      ]
    }
  })

  // 3. İADE SENARYOSU
  console.log("3. İade senaryosu oluşturuluyor...")
  const customer3 = await payload.create({
    collection: 'customers',
    data: {
      email: 'mehmet.kaya@example.com',
      password: 'TestPassword123!',
      name: 'Mehmet',
      surname: 'Kaya',
      phone: '05553334455',
      birthDate: '1985-11-05T00:00:00.000Z',
      gender: 'male',
      addresses: [{ title: 'Ev', district: 'Beşiktaş', address: 'Barbaros Bulvarı No:50' }]
    }
  })

  const order3 = await payload.create({
    collection: 'orders',
    data: {
      orderType: 'standard',
      totalAmount: 1200,
      status: 'delivered',
      paymentStatus: 'paid',
      customerInfo: {
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'mehmet.kaya@example.com',
        phone: '05553334455',
        district: 'Beşiktaş',
        address: 'Barbaros Bulvarı No:50'
      },
      orderItems: [
        { product: product2, quantity: 2, price: 600 }
      ]
    }
  })

  const returnRequest = await payload.create({
    collection: 'returns',
    data: {
      order: order3.id,
      customer: customer3.id,
      reason: 'damaged',
      description: 'Kutu yolda ezilmiş ve pastanın şekli bozulmuştu.',
      status: 'approved'
    }
  })

  console.log('Tüm test senaryoları başarıyla oluşturuldu!');
  process.exit(0);
}

run().catch(console.error);
