"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

interface Spin {
  userId: string
  prizeId: string
  prizeName: string
  timestamp: Date
}

const SpinsReport: React.FC = () => {
  const [spins, setSpins] = useState<Spin[]>([])

  useEffect(() => {
    fetchSpins()
  }, [])

  const fetchSpins = async () => {
    const spinsCollection = collection(db, "userSpins")
    const spinsSnapshot = await getDocs(spinsCollection)
    const spinsList = spinsSnapshot.docs.map(
      (doc) =>
        ({
          userId: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        }) as Spin,
    )
    setSpins(spinsList)
  }

  const exportToCSV = () => {
    const headers = ["User ID", "Prize ID", "Prize Name", "Timestamp"]
    const data = spins.map((spin) => [spin.userId, spin.prizeId, spin.prizeName, spin.timestamp.toLocaleString()])

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "user_spins_report.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Relatório de Giros dos Usuários</h2>
      <button onClick={exportToCSV} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Exportar para CSV
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID do Usuário</th>
            <th className="border p-2">ID do Prêmio</th>
            <th className="border p-2">Nome do Prêmio</th>
            <th className="border p-2">Data e Hora</th>
          </tr>
        </thead>
        <tbody>
          {spins.map((spin) => (
            <tr key={spin.userId}>
              <td className="border p-2">{spin.userId}</td>
              <td className="border p-2">{spin.prizeId}</td>
              <td className="border p-2">{spin.prizeName}</td>
              <td className="border p-2">{spin.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SpinsReport

