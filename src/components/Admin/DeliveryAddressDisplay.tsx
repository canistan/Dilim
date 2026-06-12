'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const DeliveryAddressDisplay: React.FC = () => {
  const district = useFormFields(([fields]) => fields['customerInfo.district'])
  const address = useFormFields(([fields]) => fields['customerInfo.address'])

  if (!district?.value && !address?.value) return null;

  return (
    <div className="field-type" style={{ marginBottom: '20px' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '8px', color: 'var(--theme-elevation-500)', fontSize: '13px' }}>Girilen Teslimat Adresi</label>
      <div style={{ padding: '12px 16px', backgroundColor: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)', borderRadius: '4px', fontSize: '14px', lineHeight: '1.5' }}>
        {district?.value && <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>İlçe: {district.value as string}</p>}
        {address?.value && <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{address.value as string}</p>}
      </div>
    </div>
  )
}
