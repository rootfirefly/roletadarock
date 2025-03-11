import fs from "fs"
import path from "path"
import archiver from "archiver"

// Função para criar o arquivo ZIP
async function compressProject() {
  console.log("Iniciando compactação do projeto...")

  // Caminho para o arquivo de saída
  const output = fs.createWriteStream(path.join(process.cwd(), "roleta-premios.zip"))
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Nível máximo de compressão
  })

  // Eventos para monitorar o processo
  output.on("close", () => {
    console.log(`Compactação concluída! Tamanho total: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Arquivo salvo como: ${path.join(process.cwd(), "roleta-premios.zip")}`)
  })

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.warn("Aviso:", err)
    } else {
      throw err
    }
  })

  archive.on("error", (err) => {
    throw err
  })

  // Pipe do arquivo de saída
  archive.pipe(output)

  // Diretórios e arquivos a serem incluídos
  const directoriesToInclude = ["src", "public", "components", "scripts"]

  const filesToInclude = [
    "package.json",
    "next.config.js",
    "postcss.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    ".eslintrc.json",
    "README.md",
  ]

  // Adicionar diretórios
  for (const dir of directoriesToInclude) {
    if (fs.existsSync(dir)) {
      console.log(`Adicionando diretório: ${dir}`)
      archive.directory(dir, dir)
    } else {
      console.log(`Diretório não encontrado: ${dir}, pulando...`)
    }
  }

  // Adicionar arquivos individuais
  for (const file of filesToInclude) {
    if (fs.existsSync(file)) {
      console.log(`Adicionando arquivo: ${file}`)
      archive.file(file, { name: file })
    } else {
      console.log(`Arquivo não encontrado: ${file}, pulando...`)
    }
  }

  // Finalizar o arquivo
  await archive.finalize()
}

// Executar a função
compressProject().catch((err) => {
  console.error("Erro durante a compactação:", err)
  process.exit(1)
})

