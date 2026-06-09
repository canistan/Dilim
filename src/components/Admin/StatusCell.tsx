import React from 'react'

const statusColors: Record<string, string> = {
  pending: '#eab308', // yellow
  preparing: '#3b82f6', // blue
  shipped: '#a855f7', // purple
  delivered: '#22c55e', // green
  paid: '#22c55e', // green
  unpaid: '#ef4444', // red
  failed: '#ef4444', // red
  cancelled: '#64748b', // slate
  
  // Custom Cakes statuses
  fiyat_verildi: '#3b82f6',
  onaylandi: '#22c55e',
  reddedildi: '#ef4444',
}

const statusLabels: Record<string, string> = {
  pending: 'Bekliyor',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  paid: 'Ödendi',
  unpaid: 'Ödenmedi',
  failed: 'Başarısız',
  cancelled: 'İptal Edildi',
  
  fiyat_verildi: 'Fiyat Verildi',
  onaylandi: 'Onaylandı',
  reddedildi: 'Reddedildi',
}

export const StatusCell = ({ cellData }: { cellData: string }) => {
  if (!cellData) return null;
  
  const color = statusColors[cellData] || '#6b7280'
  const label = statusLabels[cellData] || cellData

  return (
    <span
      style={{
        backgroundColor: `${color}20`,
        color: color,
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 'bold',
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  )
}
