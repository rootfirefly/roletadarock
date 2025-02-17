"use client"

import type React from "react"
import { useState } from "react"

interface UserInfoPopupProps {
  onSubmit: (name: string, email: string, whatsapp: string) => void
  onClose: () => void
}

const UserInfoPopup: React.FC<UserInfoPopupProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, email, whatsapp)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Resgatar Prêmio</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Digite seu nome completo"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Resgatar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserInfoPopup

