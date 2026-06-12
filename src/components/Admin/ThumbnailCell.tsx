import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const ThumbnailCell = async ({ rowData, cellData, collectionSlug }: any) => {
  const collection = collectionSlug || 'products';
  const fallback = (
    <Link href={`/admin/collections/${collection}/${rowData.id}`} style={{ display: 'block' }}>
      <div style={{width: 40, height: 40, background: '#e2e8f0', borderRadius: 6}} />
    </Link>
  )
  
  // Use cellData (the value of the specific field) if available, otherwise try rowData.images or rowData.image
  let imageRef = cellData;
  if (!imageRef) {
    const images = rowData?.images || [];
    imageRef = Array.isArray(images) && images.length > 0 ? images[0] : rowData?.image;
  }
  if (Array.isArray(imageRef) && imageRef.length > 0) imageRef = imageRef[0];
  
  if (!imageRef) return fallback;

  let url = null;
  
  if (typeof imageRef === 'object' && imageRef.url) {
    url = imageRef.url;
  } 
  else if (typeof imageRef === 'string' || typeof imageRef === 'number') {
    try {
      const payload = await getPayload({ config: configPromise })
      const mediaDoc = await payload.findByID({
        collection: 'media',
        id: imageRef as string | number,
      })
      if (mediaDoc && mediaDoc.url) {
        url = mediaDoc.url;
      }
    } catch (e) {}
  }

  if (!url) return fallback;

  return (
    <Link href={`/admin/collections/${collection}/${rowData.id}`} style={{ display: 'block' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
        <img src={url} alt="Görsel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </Link>
  )
}
