'use client'

import React from 'react'
import Image from 'next/image'
import logoImage from '../../../public/DilimPastLogo-final.png'

export const Logo = () => {
  return (
    <div style={{ 
      padding: '8px 16px', 
      marginBottom: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Image
        src={logoImage}
        alt="Dilim Pastaneleri"
        width={160}
        height={36}
        style={{ height: '36px', width: 'auto' }}
        priority
      />
    </div>
  )
}

export const Icon = () => {
  return (
    <div style={{ 
      padding: '4px 8px',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
    }}>
      <Image
        src={logoImage}
        alt="Dilim"
        width={120}
        height={24}
        style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
        priority
      />
    </div>
  )
}
