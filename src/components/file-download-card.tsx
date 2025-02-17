"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { downloadFile } from "@/utils/download-utils"

interface FileInfo {
  name: string
  path: string
  type: string
}

interface FileDownloadCardProps {
  file: FileInfo
}

const FileDownloadCard: React.FC<FileDownloadCardProps> = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadFile(file.path, file.name)
    } catch (error) {
      console.error("Error downloading file:", error)
      // You might want to show an error message to the user here
    }
    setIsDownloading(false)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">{file.name}</h2>
        <p className="text-gray-600 mb-4">Tipo: {file.type}</p>
      </div>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`${
          isDownloading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white font-bold py-2 px-4 rounded transition duration-300`}
      >
        {isDownloading ? "Baixando..." : "Download"}
      </button>
    </motion.div>
  )
}

export default FileDownloadCard

