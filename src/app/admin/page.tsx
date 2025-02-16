"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { getDoc, doc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { auth, db } from "../../firebase"
import { Trash2, Edit, Plus, Save, X, Download } from "lucide-react"

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

  if (loading) {
    return <div className="text-center mt-8">Carregando...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Painel de Administração</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Lista de Ganhadores */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Lista de Ganhadores</h2>
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Download size={20} className="mr-2" />
                    Exportar CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
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
                        <tr key={winner.id}>
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
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens da Roleta</h2>
                <div className="space-y-4">
                  {prizes.map((prize) => (
                    <div key={prize.id} className="flex items-center justify-between">
                      {editingPrize && editingPrize.id === prize.id ? (
                        <>
                          <input
                            type="text"
                            value={editingPrize.name}
                            onChange={(e) => setEditingPrize({ ...editingPrize, name: e.target.value })}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            value={editingPrize.quantity}
                            onChange={(e) =>
                              setEditingPrize({ ...editingPrize, quantity: Number.parseInt(e.target.value) })
                            }
                            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <button onClick={handleSavePrize} className="text-green-600 hover:text-green-800">
                            <Save size={20} />
                          </button>
                          <button onClick={() => setEditingPrize(null)} className="text-red-600 hover:text-red-800">
                            <X size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-900">{prize.name}</span>
                          <span className="text-sm text-gray-500">Quantidade: {prize.quantity}</span>
                          <button onClick={() => handleEditPrize(prize)} className="text-blue-600 hover:text-blue-800">
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeletePrize(prize.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {prizes.length < 6 && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">Adicionar Novo Item</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newPrize.name}
                        onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                        placeholder="Nome do item"
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        value={newPrize.quantity}
                        onChange={(e) => setNewPrize({ ...newPrize, quantity: Number.parseInt(e.target.value) })}
                        placeholder="Quantidade"
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        onClick={handleAddPrize}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    </div>
  )
}

export default AdminPage

