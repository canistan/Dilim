const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  'acarlar.jpg', 'accor.jpg', 'acn.jpg', 'akbank.jpg', 'albaraka.jpg',
  'anadol.jpg', 'aras.jpg', 'beykoz.jpg', 'borusan.jpg', 'doga.jpg',
  'garanti-leasing.jpg', 'garanti-portfoy.jpg', 'garanti.jpg', 'groupama.jpg',
  'ing-bank.jpg', 'istek.jpg', 'novartis.jpg', 'oytek.jpg', 'sardunya.jpg'
];

const baseUrl = 'https://www.dilim.com.tr/images/ref/';

images.forEach(img => {
  const url = baseUrl + img;
  const filePath = path.join(__dirname, 'public', 'referanslar', img);
  
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${img}`);
      });
    } else {
      console.log(`Failed to download ${img}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${img}:`, err.message);
  });
});
