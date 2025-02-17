"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

interface Participant {
  id: string
  name: string
  email: string
  whatsapp: string
  prizeName: string
  timestamp: Date
}

const ParticipantsList: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    fetchParticipants()
  }, [])

  const fetchParticipants = async () => {
    const participantsCollection = collection(db, "userSpins")
    const participantsSnapshot = await getDocs(participantsCollection)
    const participantsList = participantsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Participant[]
    setParticipants(participantsList)
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lista de Participantes e Prêmios</h2>
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
            {participants.map((participant) => (
              <tr key={participant.id} className="border-b">
                <td className="px-4 py-2">{participant.name}</td>
                <td className="px-4 py-2">{participant.email}</td>
                <td className="px-4 py-2">{participant.whatsapp}</td>
                <td className="px-4 py-2">{participant.prizeName}</td>
                <td className="px-4 py-2">{participant.timestamp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ParticipantsList

