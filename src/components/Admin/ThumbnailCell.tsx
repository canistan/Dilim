import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const ThumbnailCell = async ({ rowData, collectionSlug = 'products' }: any) => {
  const fallback = (
    <Link href={`/admin/collections/${collectionSlug}/${rowData.id}`} style={{ display: 'block' }}>
      <div style={{width: 40, height: 40, background: '#e2e8f0', borderRadius: 6}} />
    </Link>
  )
  
  const images = rowData?.images || [];
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  
  if (!firstImage) return fallback;

  let url = null;
  
  if (typeof firstImage === 'object' && firstImage.url) {
    url = firstImage.url;
  } 
  else if (typeof firstImage === 'string' || typeof firstImage === 'number') {
    try {
      const payload = await getPayload({ config: configPromise })
      const mediaDoc = await payload.findByID({
        collection: 'media',
        id: firstImage as string | number,
      })
      if (mediaDoc && mediaDoc.url) {
        url = mediaDoc.url;
      }
    } catch (e) {}
  }

  if (!url) return fallback;

  return (
    <Link href={`/admin/collections/${collectionSlug}/${rowData.id}`} style={{ display: 'block' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
        <img src={url} alt="Ürün" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </Link>
  )
}
