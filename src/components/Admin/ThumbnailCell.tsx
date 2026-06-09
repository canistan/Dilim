import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const ThumbnailCell = async ({ cellData }: any) => {
  const fallback = <div style={{width: 40, height: 40, background: '#222', borderRadius: 4}} />
  
  if (!cellData) return fallback
  
  let mediaId = Array.isArray(cellData) ? cellData[0] : cellData;
  if (typeof mediaId === 'object' && mediaId !== null && 'id' in mediaId) {
    mediaId = mediaId.id;
  }

  if (!mediaId || typeof mediaId !== 'string' && typeof mediaId !== 'number') {
    return fallback;
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const media = await payload.findByID({
      collection: 'media',
      id: mediaId as any,
    })
    
    if (media?.url) {
      return (
        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #333' }}>
          <img src={media.url} alt="Görsel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )
    }
  } catch(e) {
    // Ignore errors (e.g. if media not found)
  }
  
  return fallback
}
