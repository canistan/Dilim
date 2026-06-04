'use client'

import React from 'react'

export const Logo = () => {
  return (
    <div style={{ 
      padding: '12px 24px', 
      backgroundColor: '#ffffff', 
      borderRadius: '8px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid #e2aa45'
    }}>
      <img
        src="/DilimPastLogo-final.png"
        alt="Dilim Pastaneleri"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: '45px' }}
      />
    </div>
  )
}

export const Icon = () => {
  return (
    <div style={{ 
      padding: '8px', 
      backgroundColor: '#ffffff', 
      borderRadius: '6px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <img
        src="/DilimPastLogo-final.png"
        alt="Dilim Pastaneleri"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: '24px' }}
      />
    </div>
  )
}
