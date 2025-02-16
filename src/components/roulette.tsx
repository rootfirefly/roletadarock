"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc, addDoc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { db, auth } from "../firebase"
import Wheel from "./wheel"

interface Prize {
  id: string
  name: string
  quantity: number
}

interface User {
  id: string
  name: string
  email: string
  whatsapp: string
  hasSpun: boolean
}

const Roulette: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [selectedPrizeIndex, setSelectedPrizeIndex] = useState(0)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchPrizes()
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getUserData(currentUser.uid)
        if (userDoc) {
          setUser(userDoc)
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchPrizes = async () => {
    const prizesCollection = collection(db, "prizes")
    const prizesSnapshot = await getDocs(prizesCollection)
    const prizesList = prizesSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Prize)
      .filter((prize) => prize.quantity > 0)
    setPrizes(prizesList)
  }

  const getUserData = async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User
    }
    return null
  }

  const handleSpinComplete = () => {
    setSpinning(false)
  }

  const spin = async () => {
    if (!user) {
      setResult("Por favor, faça login para girar a roleta.")
      return
    }

    if (user.hasSpun) {
      setResult("Você já girou a roleta uma vez. Cada usuário só pode girar uma vez.")
      return
    }

    if (prizes.length === 0) {
      setResult("Desculpe, todos os prêmios acabaram!")
      return
    }

    setSpinning(true)
    setResult(null)

    const totalSpaces = 6
    const randomSpace = Math.floor(Math.random() * totalSpaces)
    const prizeIndex = randomSpace % prizes.length
    const prize = prizes[prizeIndex]

    setSelectedPrizeIndex(randomSpace)

    setTimeout(async () => {
      setResult(`Parabéns! Você ganhou: ${prize.name}`)
      handleSpinComplete()

      // Record the winner
      await addDoc(collection(db, "ganhadores"), {
        userId: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        premio: prize.name,
        timestamp: new Date(),
      })

      // Update prize quantity
      const prizeRef = doc(db, "prizes", prize.id)
      await updateDoc(prizeRef, {
        quantity: prize.quantity - 1,
      })

      // Update user's hasSpun status
      const userRef = doc(db, "users", user.id)
      await updateDoc(userRef, {
        hasSpun: true,
      })

      // Update local user state
      setUser({ ...user, hasSpun: true })

      fetchPrizes() // Refresh prizes list
    }, 5000)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
      <Wheel
        spinning={spinning}
        onSpinComplete={handleSpinComplete}
        selectedPrizeIndex={selectedPrizeIndex}
        prizes={prizes}
      />

      <div className="mt-8">
        <button
          onClick={spin}
          disabled={spinning || prizes.length === 0 || !user || user.hasSpun}
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full ${
            spinning || prizes.length === 0 || !user || user.hasSpun
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          } transition duration-300`}
        >
          {spinning ? "Girando..." : "Girar a Roleta"}
        </button>
      </div>

      {result && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">{result}</div>}

      {user && user.hasSpun && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Você já girou a roleta. Cada usuário só pode girar uma vez.
        </div>
      )}

      {prizes.length === 0 && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          Todos os prêmios acabaram. A roleta está desativada.
        </div>
      )}
    </div>
  )
}

export default Roulette

