import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import archiver from "archiver"
import { Readable } from "stream"

export async function GET() {
  console.log("Iniciando processo de download dos arquivos do sistema")

  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  const rootDir = process.cwd()
  const srcDir = path.join(rootDir, "src")

  try {
    console.log("Verificando acesso ao diretório src:", srcDir)
    await fs.access(srcDir)
    console.log("Diretório src encontrado")

    console.log("Iniciando criação do arquivo ZIP")
    archive.directory(srcDir, "src")

    const chunks: Uint8Array[] = []
    archive.on("data", (chunk) => chunks.push(chunk))

    archive.on("error", (err) => {
      console.error("Erro ao criar arquivo ZIP:", err)
      throw err
    })

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn("Aviso ao criar arquivo ZIP:", err)
      } else {
        throw err
      }
    })

    let entryCount = 0
    archive.on("entry", (entry) => {
      entryCount++
      console.log(`Arquivo adicionado ao ZIP (${entryCount}):`, entry.name)
    })

    console.log("Finalizando arquivo ZIP")
    await archive.finalize()
    console.log(`Arquivo ZIP finalizado com sucesso. Total de arquivos: ${entryCount}`)

    const headers = new Headers()
    headers.set("Content-Type", "application/zip")
    headers.set("Content-Disposition", "attachment; filename=system-files.zip")

    console.log("Retornando resposta com o arquivo ZIP")
    return new NextResponse(Readable.from(Buffer.concat(chunks)), { headers })
  } catch (error) {
    console.error("Erro ao criar arquivo ZIP:", error)
    return NextResponse.json({ error: "Falha ao criar arquivo ZIP", details: error.message }, { status: 500 })
  }
}

