"use client"

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import React from "react"
import { useRouter } from "next/router"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Roleta com Prêmios",
  description: "Gire a roleta e ganhe prêmios incríveis!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    if (!loading && !user && router.pathname.startsWith("/admin")) {
      router.push("/")
    }
  }, [user, loading, router])

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

