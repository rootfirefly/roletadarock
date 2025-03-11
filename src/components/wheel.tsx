"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface Prize {
  id: string
  name: string
  quantity: number
}

interface WheelProps {
  spinning: boolean
  onSpinComplete: () => void
  selectedPrizeIndex: number
  prizes: Prize[]
}

const Wheel: React.FC<WheelProps> = ({ spinning, onSpinComplete, selectedPrizeIndex, prizes }) => {
  const totalSpaces = 6
  const controls = useAnimation()
  const [currentRotation, setCurrentRotation] = useState(0)

  useEffect(() => {
    if (spinning) {
      const finalRotation = -(selectedPrizeIndex * (360 / totalSpaces) + 180 / totalSpaces) + 1800 // 5 full rotations + final position

      controls
        .start({
          rotate: [currentRotation, finalRotation],
          transition: {
            duration: 5,
            ease: [0.2, 0.8, 0.6, 1], // Custom easing function for fast start and slow end
          },
        })
        .then(() => {
          onSpinComplete()
          setCurrentRotation(finalRotation % 360) // Update current rotation
        })
    }
  }, [spinning, selectedPrizeIndex, controls, onSpinComplete, currentRotation])

  // Função para calcular a posição do texto em cada seção
  const calculateTextPosition = (index: number) => {
    const angle = (index * 360) / totalSpaces + 180 / totalSpaces // +180/totalSpaces para centralizar
    const radius = 200 // Ajustado para ficar no meio da seção
    const radian = (angle - 90) * (Math.PI / 180) // -90 para começar do topo
    const x = 250 + radius * Math.cos(radian)
    const y = 250 + radius * Math.sin(radian)
    return { x, y, angle: angle }
  }

  // Função para gerar os caminhos das seções da roleta
  const generateWheelPaths = () => {
    const angle = 360 / totalSpaces
    const colors = ["#0068de", "#ffbf33"]

    return Array.from({ length: totalSpaces }).map((_, index) => {
      const startAngle = index * angle
      const endAngle = (index + 1) * angle
      const startRad = (startAngle - 90) * (Math.PI / 180)
      const endRad = (endAngle - 90) * (Math.PI / 180)

      const x1 = 250 + 250 * Math.cos(startRad)
      const y1 = 250 + 250 * Math.sin(startRad)
      const x2 = 250 + 250 * Math.cos(endRad)
      const y2 = 250 + 250 * Math.sin(endRad)

      const largeArcFlag = angle > 180 ? 1 : 0

      return (
        <path
          key={index}
          d={`M250 250 L${x1} ${y1} A250 250 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
          fill={colors[index % colors.length]}
        />
      )
    })
  }

  // Função para distribuir os prêmios nos 6 espaços
  const distributePrizes = () => {
    const distributedPrizes = []
    for (let i = 0; i < totalSpaces; i++) {
      if (prizes.length > 0) {
        const prizeIndex = i % prizes.length
        distributedPrizes.push(prizes[prizeIndex])
      } else {
        // If there are no prizes, add a placeholder
        distributedPrizes.push({ id: `empty-${i}`, name: "Vazio", quantity: 0 })
      }
    }
    return distributedPrizes
  }

  const distributedPrizes = distributePrizes()

  // Função para quebrar o texto em várias linhas
  const wrapText = (text: string, maxLength: number) => {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? " " : "") + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    })
    lines.push(currentLine)

    return lines
  }

  return (
    <div className="relative w-full pb-[100%]">
      <motion.div className="absolute inset-0" animate={controls}>
        <svg viewBox="0 0 500 500" className="w-full h-full">
          {/* Fundo da roleta */}
          <circle cx="250" cy="250" r="250" fill="#1a365d" />

          {/* Seções da roleta */}
          {generateWheelPaths()}

          {/* Textos dos prêmios */}
          <g className="text-white fill-current">
            {distributedPrizes.map((prize, index) => {
              const pos = calculateTextPosition(index)
              const lines = wrapText(prize.name, 12)
              return (
                <g key={`${prize.id}-${index}`}>
                  {lines.map((line, lineIndex) => (
                    <text
                      key={`${prize.id}-${index}-${lineIndex}`}
                      x={pos.x}
                      y={pos.y + lineIndex * 20 - (lines.length - 1) * 10}
                      transform={`rotate(${pos.angle}, ${pos.x}, ${pos.y})`}
                      textAnchor="middle"
                      className="font-bold text-sm"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}
          </g>

          {/* Logo no centro da roleta */}
          <image
            href="https://cursosuperautomacao.wwon.com.br/arquivos/upload/20250214_232556.png"
            x="175"
            y="175"
            width="150"
            height="150"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </motion.div>
      {/* Seta indicadora */}
      <div className="absolute top-0 left-1/2 -ml-4 w-8 h-16">
        <svg viewBox="0 0 32 64" className="w-full h-full">
          <path d="M16 0 L32 32 L16 64 L0 32 Z" fill="#000000" />
        </svg>
      </div>
    </div>
  )
}

export default Wheel

