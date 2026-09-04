import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body; // Array of { name: 'CEVİZLİ BAKLAVA', filePath: '/path/to/image.jpg' }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Invalid items array' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const results = [];

    for (const item of items) {
      if (!fs.existsSync(item.filePath)) {
        results.push({ name: item.name, success: false, error: 'File not found' });
        continue;
      }

      // Convert to WebP using sharp
      const webpBuffer = await sharp(item.filePath)
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.webp`;
      const tempPath = path.join('/tmp', fileName);
      fs.writeFileSync(tempPath, webpBuffer);

      // Find the product
      const { docs: products } = await payload.find({
        collection: 'products' as any,
        where: { title: { equals: item.name } },
      });

      if (products.length === 0) {
        results.push({ name: item.name, success: false, error: 'Product not found in DB' });
        continue;
      }

      const product = products[0];

      // Read file for payload upload
      const fileData = fs.readFileSync(tempPath);
      const fileSize = fs.statSync(tempPath).size;

      // Create Media document
      const media = await payload.create({
        collection: 'media' as any,
        data: {
          alt: item.name,
        },
        file: {
          data: fileData,
          mimetype: 'image/webp',
          name: fileName,
          size: fileSize,
        },
      });

      // Update product with new media
      let currentImages = product.images || [];
      if (typeof currentImages === 'object' && !Array.isArray(currentImages)) {
         // Payload returns relationships in different formats depending on depth. Assuming it's an array of IDs if we use depth 0 or an array of objects.
         currentImages = [];
      }
      
      const updatedImages = [...currentImages.map((img: any) => typeof img === 'object' ? img.id : img), media.id];

      await payload.update({
        collection: 'products' as any,
        id: product.id,
        data: {
          images: updatedImages,
        },
      });

      results.push({ name: item.name, success: true, mediaId: media.id });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
