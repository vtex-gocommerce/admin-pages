import React, { CSSProperties, useEffect, useState } from 'react'

import LoadingIcons from './icons/LoadingIcons'

const IFRAME_ID = 'store-iframe'

const LoadingScreen: React.SFC = () => {
  const [style, setStyle] = useState<CSSProperties>()

  const getIframeStyle = () => {
    const iframe = document.getElementById(IFRAME_ID)
    if (iframe) {
      const iframeRect = iframe.getBoundingClientRect() as DOMRect
      const { x: left, y, width, height } = iframeRect
      setStyle({
        height,
        left,
        top: y - 48,
        width,
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      getIframeStyle()
    })
    getIframeStyle()
  }, [])

  return (
    <div
      style={style}
      className="flex justify-around items-center absolute bg-white-90 z-1"
    >
      <LoadingIcons />
    </div>
  )
}

export default LoadingScreen
