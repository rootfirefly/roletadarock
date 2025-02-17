import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Remove qualquer middleware que possa estar causando redirecionamento
  return NextResponse.next()
}

