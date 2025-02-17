"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

interface Winner {
  id: string
  name: string
  email: string
  whatsapp: string
  premio: string
  timestamp: Date
}

const ParticipationReport: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([])

  useEffect(() => {
    fetchWinners()
  }, [])

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

  const exportToCSV = () => {
    const headers = ["Nome", "E-mail", "WhatsApp", "Prêmio", "Data de Participação"]
    const data = winners.map((w) => [w.name, w.email, w.whatsapp, w.premio, w.timestamp.toLocaleString()])

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "ganhadores.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Relatório de Ganhadores</h2>
      <button onClick={exportToCSV} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Exportar para CSV
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">WhatsApp</th>
              <th className="px-4 py-2">Prêmio</th>
              <th className="px-4 py-2">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner) => (
              <tr key={winner.id} className="border-b">
                <td className="px-4 py-2">{winner.name}</td>
                <td className="px-4 py-2">{winner.email}</td>
                <td className="px-4 py-2">{winner.whatsapp}</td>
                <td className="px-4 py-2">{winner.premio}</td>
                <td className="px-4 py-2">{winner.timestamp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ParticipationReport

