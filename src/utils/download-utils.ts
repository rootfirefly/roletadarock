import { getStorage, ref, getDownloadURL } from "firebase/storage"

export const downloadFile = async (filePath: string, fileName: string) => {
  const storage = getStorage()
  const fileRef = ref(storage, filePath)

  try {
    const url = await getDownloadURL(fileRef)
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error("Error downloading file:", error)
    throw error
  }
}

