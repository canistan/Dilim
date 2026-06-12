import React from 'react'

const typeColors: Record<string, string> = {
  standard: '#64748b', // slate
  custom: '#ec4899', // pink
}

const typeLabels: Record<string, string> = {
  standard: 'Standart Sepet Siparişi',
  custom: 'Özel Tasarım Pasta Talebi',
}

export const OrderTypeCell = ({ cellData }: { cellData: string }) => {
  if (!cellData) return null;
  
  const color = typeColors[cellData] || '#6b7280'
  const label = typeLabels[cellData] || cellData

  return (
    <span
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}40`,
        color: color,
        padding: '3px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        display: 'inline-block',
      }}
    >
      {cellData === 'custom' && <span style={{ marginRight: '6px' }}>✨</span>}
      {label}
    </span>
  )
}
