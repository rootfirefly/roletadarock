"\"use client"

import type React from "react"
import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Download } from "lucide-react"

const QRCodeGenerator: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateQRCode()
  }, [])

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      // Get the current URL without any path (just the domain)
      const baseUrl = window.location.origin
      const qrCodeDataUrl = await QRCode.toDataURL(baseUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
      setQrCodeUrl(qrCodeDataUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
    setIsGenerating(false)
  }

  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = "roleta-qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code da Roleta</h2>
        <div className="flex flex-col items-center space-y-4">
          {isGenerating ? (
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            qrCodeUrl && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code da Roleta" className="w-[200px] h-[200px]" />
              </div>
            )
          )}
          <button
            onClick={downloadQRCode}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar QR Code
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator

