"use client"

import type React from "react"
import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

interface QRCodeGeneratorProps {
  url: string
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const [size, setSize] = useState(256)

  const handleDownload = () => {
    const svg = document.getElementById("qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = size
        canvas.height = size
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = "roulette-qr-code.png"
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <QRCodeSVG id="qr-code" value={url} size={size} level="H" />
      <div className="flex items-center space-x-4">
        <label htmlFor="size" className="text-sm font-medium text-gray-700">
          Tamanho:
        </label>
        <input
          type="range"
          id="size"
          min="128"
          max="512"
          step="32"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-48"
        />
        <span>{size}px</span>
      </div>
      <button
        onClick={handleDownload}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Download QR Code
      </button>
    </div>
  )
}

export default QRCodeGenerator

