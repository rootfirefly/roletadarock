"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import RegistrationForm from "../components/registration-form"
import LoginForm from "../components/login-form"
import Roulette from "../components/roulette"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().userType === "admin") {
          router.push("/admin")
        } else {
          setIsAuthenticated(true)
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleAuthComplete = (isAdmin: boolean) => {
    if (isAdmin) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-yellow-400">
      {isAuthenticated ? (
        <div className="container mx-auto px-4 py-4 relative">
          <Roulette />
        </div>
      ) : showLogin ? (
        <LoginForm onLoginComplete={handleAuthComplete} />
      ) : (
        <RegistrationForm onRegistrationComplete={() => handleAuthComplete(false)} />
      )}
      {!isAuthenticated && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="bg-white text-yellow-600 font-bold py-2 px-4 rounded hover:bg-yellow-100 transition duration-300"
          >
            {showLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
          </button>
        </div>
      )}
    </div>
  )
}

