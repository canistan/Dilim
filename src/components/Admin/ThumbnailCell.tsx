import React from 'react'

export const ThumbnailCell = ({ rowData }: any) => {
  const fallback = <div style={{width: 40, height: 40, background: '#e2e8f0', borderRadius: 6}} />
  
  // Payload v3 sends the fully populated rowData in the list view usually
  const images = rowData?.images || [];
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  
  let url = null;
  if (typeof firstImage === 'object' && firstImage !== null && firstImage.url) {
    url = firstImage.url;
  } else if (typeof firstImage === 'string' && firstImage.startsWith('/')) {
    url = firstImage;
  }

  if (!url) {
    return fallback;
  }

  return (
    <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      <img src={url} alt="Ürün" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )
}
