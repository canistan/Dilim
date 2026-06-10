const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/odeme-baslat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerInfo: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "05555555555",
        address: "Test adres",
        district: "Test Ilce",
      },
      items: [{ id: 1, name: "Test Urun", quantity: 1, price: 100 }],
      totalAmount: 100
    })
  });
  
  const text = await res.text();
  console.log(text);
}

test();
