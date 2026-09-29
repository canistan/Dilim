import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';

async function fixSakalli() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const dallePrompt = "A high-quality, mouth-watering professional food photography of a traditional Turkish bakery savory pastry called 'Sakallı Poğaça'. It is a small, round, golden-brown baked mini pastry bun, sliced open horizontally like a small sandwich. The inside is generously filled with cream cheese, and the exposed edges of the cream cheese filling are beautifully coated with finely chopped fresh green parsley and a little bit of grated yellow cheese. It is placed on a modern clean marble bakery counter. Bright, natural lighting, soft shadows, authentic bakery photography style, extremely realistic, 4k resolution.";

  const outputDir = path.join(os.homedir(), 'Desktop', 'Dilim_Gorsel_Onay', 'KURABİYE VE BÖREKLER');
  
  console.log("Sakallı için yepyeni bir görsel üretiliyor...");
  
  const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'chatgpt-image-latest',
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024'
    })
  });

  const imageData = await imageRes.json();
  
  if (!imageRes.ok || !imageData.data || (!imageData.data[0].url && !imageData.data[0].b64_json)) {
    console.error(`❌ Hata:`, JSON.stringify(imageData));
    process.exit(1);
  }

  let buffer: Buffer;
  if (imageData.data[0].b64_json) {
    buffer = Buffer.from(imageData.data[0].b64_json, 'base64');
  } else {
    const imgFetch = await fetch(imageData.data[0].url);
    buffer = Buffer.from(await imgFetch.arrayBuffer());
  }

  const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
  
  const imagePath = path.join(outputDir, `SAKALLI.webp`);
  const promptPath = path.join(outputDir, `SAKALLI_prompt.txt`);

  fs.writeFileSync(imagePath, webpBuffer);
  fs.writeFileSync(promptPath, dallePrompt);

  console.log(`✅ Başarıyla düzeltildi ve kaydedildi: ${imagePath}`);
}

fixSakalli().catch(console.error);
