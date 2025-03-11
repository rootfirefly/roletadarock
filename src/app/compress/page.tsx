"use client"

import { useState, useRef } from "react"
import JSZip from "jszip"
import FileSaver from "file-saver"
const { saveAs } = FileSaver

export default function CompressPage() {
  const [status, setStatus] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCompress = async () => {
    if (!fileInputRef.current?.files?.length) {
      setStatus("Por favor, selecione arquivos para compactar")
      return
    }

    try {
      setStatus("Iniciando compactação...")
      setProgress(0)

      const zip = new JSZip()
      const files = fileInputRef.current.files

      // Adicionar arquivos ao ZIP
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setStatus(`Adicionando arquivo: ${file.name}`)

        // Ler o arquivo como ArrayBuffer
        const content = await file.arrayBuffer()

        // Adicionar ao ZIP
        zip.file(file.name, content)

        // Atualizar progresso
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      setStatus("Gerando arquivo ZIP...")

      // Gerar o ZIP
      const zipBlob = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 9 },
        },
        (metadata) => {
          setProgress(Math.round(metadata.percent))
        },
      )

      // Salvar o arquivo
      saveAs(zipBlob, "roleta-premios.zip")

      setStatus("Compactação concluída com sucesso!")
    } catch (error) {
      console.error("Erro durante a compactação:", error)
      setStatus(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    }
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Compactar Arquivos</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Selecione os arquivos para compactar:</label>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-yellow-50 file:text-yellow-700
              hover:file:bg-yellow-100"
          />
        </div>

        <button
          onClick={handleCompress}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Compactar Arquivos
        </button>

        {status && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-2">{status}</p>
            {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

