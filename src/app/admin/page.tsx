"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { getDoc, doc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { auth, db } from "../../firebase"
import { Trash2, Edit, Plus, Save, X, Download, Archive, BarChart, Gift, Users, LogOut, QrCode } from "lucide-react"
import QRCodeGenerator from "@/components/qr-code-generator"

interface Winner {
  id: string
  name: string
  email: string
  whatsapp: string
  premio: string
  timestamp: Date
}

interface Prize {
  id: string
  name: string
  quantity: number
}

const AdminPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [winners, setWinners] = useState<Winner[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [newPrize, setNewPrize] = useState({ name: "", quantity: 0 })
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().userType === "admin") {
          setIsAdmin(true)
          fetchWinners()
          fetchPrizes()
        } else {
          router.push("/")
        }
      } else {
        router.push("/")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchWinners = async () => {
    const winnersCollection = collection(db, "ganhadores")
    const winnersSnapshot = await getDocs(winnersCollection)
    const winnersList = winnersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Winner[]
    setWinners(winnersList)
  }

  const fetchPrizes = async () => {
    const prizesCollection = collection(db, "prizes")
    const prizesSnapshot = await getDocs(prizesCollection)
    const prizesList = prizesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Prize[]
    setPrizes(prizesList)
  }

  const handleEditPrize = (prize: Prize) => {
    setEditingPrize(prize)
  }

  const handleSavePrize = async () => {
    if (editingPrize) {
      await updateDoc(doc(db, "prizes", editingPrize.id), {
        name: editingPrize.name,
        quantity: editingPrize.quantity,
      })
      setEditingPrize(null)
      fetchPrizes()
    }
  }

  const handleDeletePrize = async (id: string) => {
    await deleteDoc(doc(db, "prizes", id))
    fetchPrizes()
  }

  const handleAddPrize = async () => {
    if (prizes.length < 6) {
      await addDoc(collection(db, "prizes"), newPrize)
      setNewPrize({ name: "", quantity: 0 })
      fetchPrizes()
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const exportToCSV = () => {
    const headers = ["Nome", "Email", "WhatsApp", "Prêmio", "Data"]
    const csvContent = [
      headers.join(";"),
      ...winners.map((winner) =>
        [winner.name, winner.email, winner.whatsapp, winner.premio, winner.timestamp.toLocaleString()].join(";"),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "lista_ganhadores.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const checkFilesReady = async () => {
    try {
      const response = await fetch("/api/check-system-files")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Resposta da verificação de arquivos:", data)
      return data.ready
    } catch (error) {
      console.error("Erro ao verificar arquivos:", error)
      throw error
    }
  }

  const downloadSystemFiles = async () => {
    setIsDownloading(true)
    setDownloadError(null)
    addDebugLog("Iniciando download dos arquivos do sistema")

    try {
      addDebugLog("Verificando se os arquivos estão prontos")
      const filesReady = await checkFilesReady()
      if (!filesReady) {
        throw new Error("Os arquivos do sistema não estão prontos para download.")
      }
      addDebugLog("Arquivos prontos para download")

      addDebugLog("Iniciando requisição para /api/download-system-files")
      const response = await fetch("/api/download-system-files")
      addDebugLog(`Resposta recebida. Status: ${response.status}`)

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(`Erro no servidor: ${errorData.error}. Detalhes: ${errorData.details || "Sem detalhes"}`)
        } else {
          const errorText = await response.text()
          throw new Error(`Erro no servidor: ${response.status} ${response.statusText}. Detalhes: ${errorText}`)
        }
      }

      const contentType = response.headers.get("content-type")
      addDebugLog(`Tipo de conteúdo recebido: ${contentType}`)

      if (contentType && contentType !== "application/zip") {
        throw new Error(`Tipo de conteúdo inesperado: ${contentType}`)
      }

      addDebugLog("Iniciando download do blob")
      const blob = await response.blob()
      addDebugLog(`Blob recebido. Tamanho: ${blob.size} bytes`)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "system-files.zip"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      addDebugLog("Download iniciado pelo navegador")
    } catch (error) {
      console.error("Erro ao baixar arquivos:", error)
      addDebugLog(`Erro capturado: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
      setDownloadError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido")
    } finally {
      setIsDownloading(false)
      addDebugLog("Processo de download finalizado")
    }
  }

  const addDebugLog = (message: string) => {
    setDebugLogs((prevLogs) => [...prevLogs, `${new Date().toISOString()}: ${message}`])
  }

  const DebugLogs: React.FC = () => (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Logs de Depuração:</h3>
      <pre className="text-sm overflow-auto max-h-40">{debugLogs.join("\n")}</pre>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <nav className="bg-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-800">Painel de Administração</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/qr-code")}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center transition duration-150 ease-in-out"
              >
                <QrCode size={20} className="mr-2" />
                Gerador de QR Code
              </button>
              <button
                onClick={downloadSystemFiles}
                disabled={isDownloading}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  isDownloading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center transition duration-150 ease-in-out`}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Baixando...
                  </>
                ) : (
                  <>
                    <Archive size={20} className="mr-2" />
                    Download System Files
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center transition duration-150 ease-in-out"
              >
                <LogOut size={20} className="mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* QR Code Generator */}
            <div className="bg-white overflow-hidden shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <BarChart className="mr-2 text-yellow-500" /> QR Code da Roleta
                </h2>
                <QRCodeGenerator />
              </div>
            </div>

            {/* Lista de Ganhadores */}
            <div className="bg-white overflow-hidden shadow-lg rounded-lg md:col-span-2 transition duration-300 ease-in-out transform hover:scale-105">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                    <Users className="mr-2 text-yellow-500" /> Lista de Ganhadores
                  </h2>
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                  >
                    <Download size={20} className="mr-2" />
                    Exportar CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-yellow-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prêmio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {winners.map((winner) => (
                        <tr key={winner.id} className="hover:bg-yellow-50 transition duration-150 ease-in-out">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{winner.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{winner.premio}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {winner.timestamp.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Gerenciamento de Itens da Roleta */}
            <div className="bg-white overflow-hidden shadow-lg rounded-lg md:col-span-3 transition duration-300 ease-in-out transform hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <Gift className="mr-2 text-yellow-500" /> Itens da Roleta
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="bg-yellow-50 p-4 rounded-lg shadow transition duration-150 ease-in-out hover:shadow-md"
                    >
                      {editingPrize && editingPrize.id === prize.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingPrize.name}
                            onChange={(e) => setEditingPrize({ ...editingPrize, name: e.target.value })}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            value={editingPrize.quantity}
                            onChange={(e) =>
                              setEditingPrize({ ...editingPrize, quantity: Number.parseInt(e.target.value) })
                            }
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleSavePrize}
                              className="text-green-600 hover:text-green-800 transition duration-150 ease-in-out"
                            >
                              <Save size={20} />
                            </button>
                            <button
                              onClick={() => setEditingPrize(null)}
                              className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{prize.name}</span>
                            <span className="ml-2 text-sm text-gray-500">Quantidade: {prize.quantity}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPrize(prize)}
                              className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeletePrize(prize.id)}
                              className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {prizes.length < 6 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Adicionar Novo Item</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newPrize.name}
                        onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                        placeholder="Nome do item"
                        className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        value={newPrize.quantity}
                        onChange={(e) => setNewPrize({ ...newPrize, quantity: Number.parseInt(e.target.value) })}
                        placeholder="Quantidade"
                        className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        onClick={handleAddPrize}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                      >
                        <Plus size={20} className="mr-2" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {downloadError && <div className="mt-2 text-red-600 text-sm">Erro: {downloadError}</div>}
      <DebugLogs />
    </div>
  )
}

export default AdminPage

