const items = [
  {
    id: '36',
    name: 'FRAMBUAZ ÇİKOLATA',
    price: '₺750',
    quantity: 1,
  }
];

const customerInfo = {
  firstName: 'Merhaba',
  lastName: 'Dünya',
  email: 'merhaba@a.com',
  phone: '5354345678',
  district: 'Üsküdar',
  address: 'Test adresi',
  isCorporate: false
};

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerInfo,
        items,
        totalAmount: 750
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
