import fs from 'fs';
import path from 'path';

// Create a small dummy image (just a tiny transparent PNG)
const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
fs.writeFileSync('dummy.png', dummyPng);

const formData = new FormData();
formData.append('customerName', 'Test Name');
formData.append('customerPhone', '05555555555');
formData.append('customerAddress', 'Test Address');
formData.append('size', '6-8');
formData.append('base', 'vanilla');
formData.append('filling', 'pistachio');
formData.append('frosting', 'fondant');

const fileBlob = new Blob([dummyPng], { type: 'image/png' });
formData.append('referenceImage', fileBlob, 'dummy.png');

console.log('Sending request...');
try {
  const res = await fetch('http://localhost:3000/api/custom-cakes', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  console.log('Response:', data);
} catch (e) {
  console.error('Fetch error:', e);
}
