"use client"

import type React from "react"
import { useState } from "react"
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "../firebase"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface RegistrationFormProps {
  onRegistrationComplete: () => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationComplete }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!privacyPolicyAccepted) {
      setError("Você precisa aceitar a política de privacidade para se cadastrar.")
      setIsLoading(false)
      return
    }

    try {
      // Check if user already exists
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setError("Um usuário com este email já existe.")
        setIsLoading(false)
        return
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, whatsapp)
      const user = userCredential.user

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        whatsapp,
        userType: "user",
        hasSpun: false,
        privacyPolicyAccepted: true,
        createdAt: new Date(),
      })

      onRegistrationComplete()
    } catch (error) {
      console.error("Error registering user: ", error)
      if (error instanceof Error) {
        setError(`Ocorreu um erro ao registrar: ${error.message}`)
      } else {
        setError("Ocorreu um erro ao registrar. Por favor, tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-400 p-4">
      <div className="w-full max-w-md mb-8">
        <Image
          src="https://rockfeller.com.br/wp-content/uploads/2023/08/rockfeller-language-center-logotipo-topo.webp"
          alt="Rockfeller Language Center"
          width={400}
          height={100}
          className="w-full h-auto"
          priority
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Cadastre-se para Girar a Roleta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Endereço de e-mail
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Endereço de e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Número do WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacy-policy"
                name="privacy-policy"
                type="checkbox"
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                checked={privacyPolicyAccepted}
                onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="privacy-policy" className="font-medium text-gray-700">
                De acordo com a Lei nº 13.709 LGPD, eu autorizo receber contato e informações desta instituição
              </label>
              <p className="text-gray-500">
                Ao marcar esta caixa, você concorda com nossa{" "}
                <Link href="/politica-de-privacidade" className="text-yellow-600 hover:text-yellow-500">
                  política de privacidade
                </Link>
                .
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Cadastrar e Girar a Roleta"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default RegistrationForm

