"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import LoginForm from "../../components/login-form"

const LoginPage: React.FC = () => {
  const router = useRouter()

  const handleLoginComplete = (isAdmin: boolean) => {
    if (isAdmin) {
      router.push("/admin")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
      <LoginForm onLoginComplete={handleLoginComplete} />
    </div>
  )
}

export default LoginPage

