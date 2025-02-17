"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useRouter } from "next/navigation"
import RegistrationForm from "../components/registration-form"
import LoginForm from "../components/login-form"
import Roulette from "../components/roulette"

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true)
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().userType === "admin") {
          setIsAdmin(true)
          router.push("/admin")
        } else {
          setIsAdmin(false)
        }
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleAuthComplete = (isAdminUser: boolean) => {
    setIsAuthenticated(true)
    if (isAdminUser) {
      setIsAdmin(true)
      router.push("/admin")
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsAuthenticated(false)
      setIsAdmin(false)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (isAdmin) {
    return null // Não renderiza nada, pois o usuário será redirecionado para a página de admin
  }

  return (
    <div className="min-h-screen bg-yellow-400">
      {isAuthenticated ? (
        <div className="container mx-auto px-4 py-4 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Sair
            </button>
          </div>
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

export default Home

