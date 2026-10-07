const http = require('http');

const data = JSON.stringify({
  customerInfo: {
    firstName: "Şemsi",
    lastName: "Albayrak",
    email: "semsicanalbayrak@gmail.com",
    phone: "05077880172",
    district: "Üsküdar",
    address: "Üsküdar, İcadiye mahallesi, Temaşa Sokak, No:31/1",
    isCorporate: false,
    companyName: "",
    taxOffice: "",
    taxNumber: ""
  },
  items: [
    { id: 217, name: "Çikolatin (Kg)", quantity: 1, price: 2200, options: "" }
  ],
  totalAmount: 1980,
  couponCode: "CUNEYD10"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/odeme-baslat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
