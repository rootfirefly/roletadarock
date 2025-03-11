import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"

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
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <p>&copy; {new Date().getFullYear()} Rockfeller Language Center. Todos os direitos reservados.</p>
              <Link href="/politica-de-privacidade" className="hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

