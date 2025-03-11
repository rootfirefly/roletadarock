"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"

const QRCodePage: React.FC = () => {
  const router = useRouter()
  const [url, setUrl] = useState("https://roletadarock.wwon.com.br/")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
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
    link.download = "qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 flex items-center text-blue-600 transition duration-150 ease-in-out"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar para o Painel de Administração
        </button>
        <h1 className="text-3xl font-bold text-blue-800 mb-8">Gerador de QR Code</h1>
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <form onSubmit={generateQRCode} className="mb-4">
              <div className="flex flex-col space-y-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Digite a URL aqui"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5 mr-2" />
                  )}
                  Gerar QR Code
                </button>
              </div>
            </form>
            <div className="flex flex-col items-center space-y-4">
              {qrCodeUrl && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-[200px] h-[200px]" />
                </div>
              )}
              {qrCodeUrl && (
                <button
                  onClick={downloadQRCode}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar QR Code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRCodePage

