'use client'

import { useEffect } from 'react'

export function IframeBreakout() {
  useEffect(() => {
    // If we are running inside an iframe, break out of it by redirecting the top window
    if (typeof window !== 'undefined' && window.self !== window.top) {
      if (window.top) {
        window.top.location.href = window.location.href;
      }
    }
  }, [])

  return null
}
