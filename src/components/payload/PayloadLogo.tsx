'use client'

import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <div style={{ 
      padding: '12px 24px', 
      backgroundColor: '#ffffff', 
      borderRadius: '8px', 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid #e2aa45',
      color: 'black'
    }}>
      <Image
        src="/DilimPastLogo-final.png"
        alt="Dilim Pastaneleri"
        width={200}
        height={45}
        style={{ height: '45px', width: 'auto' }}
        priority
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
      justifyContent: 'center',
      color: 'black'
    }}>
      <Image
        src="/DilimPastLogo-final.png"
        alt="Dilim Pastaneleri"
        width={100}
        height={24}
        style={{ height: '24px', width: 'auto' }}
        priority
      />
    </div>
  )
}
