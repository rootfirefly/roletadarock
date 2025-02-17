"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"

interface Winner {
  id: string
  name: string
  email: string
  whatsapp: string
  premio: string
  timestamp: Date
}

const WinnersList: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([])

  useEffect(() => {
    const fetchWinners = async () => {
      const winnersCollection = collection(db, "ganhadores")
      const winnersQuery = query(winnersCollection, orderBy("timestamp", "desc"))
      const winnersSnapshot = await getDocs(winnersQuery)
      const winnersList = winnersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Winner[]
      setWinners(winnersList)
    }

    fetchWinners()
  }, [])

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prêmio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td className="px-6 py-4 whitespace-nowrap">{winner.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{winner.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{winner.whatsapp}</td>
              <td className="px-6 py-4 whitespace-nowrap">{winner.premio}</td>
              <td className="px-6 py-4 whitespace-nowrap">{winner.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WinnersList

