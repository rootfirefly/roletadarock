"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

interface Participation {
  id: string
  name: string
  email: string
  whatsapp: string
  userType: string
  prize?: string
  createdAt: Date
}

const ParticipationReport: React.FC = () => {
  const [participations, setParticipations] = useState<Participation[]>([])

  useEffect(() => {
    fetchParticipations()
  }, [])

  const fetchParticipations = async () => {
    const participationsCollection = collection(db, "users")
    const participationsSnapshot = await getDocs(participationsCollection)
    const participationsList = participationsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }) as Participation,
    )
    setParticipations(participationsList)
  }

  const exportToCSV = () => {
    const headers = ["Nome", "E-mail", "WhatsApp", "Tipo de Usuário", "Prêmio", "Data de Participação"]
    const data = participations.map((p) => [
      p.name,
      p.email,
      p.whatsapp,
      p.userType,
      p.prize || "Não ganhou",
      p.createdAt.toLocaleString(),
    ])

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "participacoes.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Relatório de Participações</h2>
      <button onClick={exportToCSV} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Exportar para CSV
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nome</th>
            <th className="border p-2">E-mail</th>
            <th className="border p-2">WhatsApp</th>
            <th className="border p-2">Tipo de Usuário</th>
            <th className="border p-2">Prêmio</th>
            <th className="border p-2">Data de Participação</th>
          </tr>
        </thead>
        <tbody>
          {participations.map((participation) => (
            <tr key={participation.id}>
              <td className="border p-2">{participation.name}</td>
              <td className="border p-2">{participation.email}</td>
              <td className="border p-2">{participation.whatsapp}</td>
              <td className="border p-2">{participation.userType}</td>
              <td className="border p-2">{participation.prize || "Não ganhou"}</td>
              <td className="border p-2">{participation.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ParticipationReport

