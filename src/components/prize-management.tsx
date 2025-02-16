"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase"

interface Prize {
  id: string
  name: string
  quantity: number
}

const PrizeManagement: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [newPrize, setNewPrize] = useState({ name: "", quantity: 0 })
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)

  useEffect(() => {
    fetchPrizes()
  }, [])

  const fetchPrizes = async () => {
    const prizesCollection = collection(db, "prizes")
    const prizesSnapshot = await getDocs(prizesCollection)
    const prizesList = prizesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Prize)
    setPrizes(prizesList)
  }

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault()
    await addDoc(collection(db, "prizes"), newPrize)
    setNewPrize({ name: "", quantity: 0 })
    fetchPrizes()
  }

  const handleUpdatePrize = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Prêmios</h2>

      <form onSubmit={handleAddPrize} className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Adicionar Novo Prêmio</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newPrize.name}
            onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
            placeholder="Nome do Prêmio"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            value={newPrize.quantity}
            onChange={(e) => setNewPrize({ ...newPrize, quantity: Number.parseInt(e.target.value) })}
            placeholder="Quantidade"
            className="w-32 px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Adicionar
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Lista de Prêmios</h3>
      <ul className="space-y-4">
        {prizes.map((prize) => (
          <li key={prize.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
            {editingPrize && editingPrize.id === prize.id ? (
              <form onSubmit={handleUpdatePrize} className="flex-grow flex space-x-4">
                <input
                  type="text"
                  value={editingPrize.name}
                  onChange={(e) => setEditingPrize({ ...editingPrize, name: e.target.value })}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="number"
                  value={editingPrize.quantity}
                  onChange={(e) => setEditingPrize({ ...editingPrize, quantity: Number.parseInt(e.target.value) })}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPrize(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <span>
                  {prize.name} (Quantidade: {prize.quantity})
                </span>
                <div>
                  <button
                    onClick={() => setEditingPrize(prize)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePrize(prize.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PrizeManagement

