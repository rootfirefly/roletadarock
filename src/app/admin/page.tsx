"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import AdminLogin from "../../components/admin-login"
import PrizeManagement from "../../components/prize-management"
import ParticipationReport from "../../components/participation-report"
import SpinsReport from "../../components/spins-report"
import QRCodeGenerator from "../../components/qr-code-generator"

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/")
        return
      }

      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists() && userDoc.data().userType === "admin") {
        setIsAdmin(true)
      } else {
        router.push("/")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />
  }

  const rouletteUrl = `${window.location.origin}/roulette`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Gerenciamento de Prêmios</h2>
          <PrizeManagement />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Relatório de Participações</h2>
          <ParticipationReport />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Relatório de Giros</h2>
          <SpinsReport />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">QR Code da Roleta</h2>
          <QRCodeGenerator url={rouletteUrl} />
        </div>
      </div>
    </div>
  )
}

