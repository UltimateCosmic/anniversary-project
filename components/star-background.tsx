"use client"

import { useEffect, useRef } from "react"

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Star properties
    const stars: {
      x: number
      y: number
      outerRadius: number
      innerRadius: number
      color: string
      targetColor: string
      colorTransitionSpeed: number
      speed: number
      alpha: number
      alphaChange: number
      rotation: number
      rotationSpeed: number
    }[] = []

    // Vivid RGB colors
    const starColors = [
      "#FF0000", // Red
      "#00FF00", // Green
      "#0000FF", // Blue
      "#00FFFF", // Cyan
      "#FF00FF", // Magenta
      "#FFFF00", // Yellow
      "#FFFFFF", // White
    ]

    // Function to draw a 5-point star
    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      outerRadius: number,
      innerRadius: number,
      rotation = 0,
    ) => {
      const points = 5
      ctx.beginPath()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI * i) / points
        if (i === 0) {
          ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle))
        } else {
          ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle))
        }
      }

      ctx.closePath()
      ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transformation
    }

    // Function to interpolate between two colors
    const interpolateColor = (color1: string, color2: string, factor: number) => {
      const r1 = Number.parseInt(color1.substring(1, 3), 16)
      const g1 = Number.parseInt(color1.substring(3, 5), 16)
      const b1 = Number.parseInt(color1.substring(5, 7), 16)

      const r2 = Number.parseInt(color2.substring(1, 3), 16)
      const g2 = Number.parseInt(color2.substring(3, 5), 16)
      const b2 = Number.parseInt(color2.substring(5, 7), 16)

      const r = Math.round(r1 + factor * (r2 - r1))
      const g = Math.round(g1 + factor * (g2 - g1))
      const b = Math.round(b1 + factor * (b2 - b1))

      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }

    // Create stars
    const createStars = () => {
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const outerRadius = Math.random() * 6 + 4 // Slightly larger to make stars more visible
        const innerRadius = outerRadius * 0.4 // Inner radius for the star shape
        const color = starColors[Math.floor(Math.random() * starColors.length)]
        const targetColor = starColors[Math.floor(Math.random() * starColors.length)]
        const colorTransitionSpeed = Math.random() * 0.005 + 0.001
        const speed = Math.random() * 0.05 + 0.01
        const alpha = Math.random() * 0.5 + 0.5
        const alphaChange = Math.random() * 0.01 + 0.005
        const rotation = Math.random() * Math.PI * 2
        const rotationSpeed = (Math.random() - 0.5) * 0.001

        stars.push({
          x,
          y,
          outerRadius,
          innerRadius,
          color,
          targetColor,
          colorTransitionSpeed,
          speed,
          alpha,
          alphaChange,
          rotation,
          rotationSpeed,
        })
      }
    }

    createStars()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star, index) => {
        ctx.save()

        // Draw the star
        drawStar(ctx, star.x, star.y, star.outerRadius, star.innerRadius, star.rotation)

        // Apply color and alpha
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.alpha
        ctx.fill()

        ctx.restore()

        // Move stars slowly
        star.y += star.speed
        star.rotation += star.rotationSpeed

        // Reset position if star goes off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
          star.targetColor = starColors[Math.floor(Math.random() * starColors.length)]
        }

        // Twinkle effect
        star.alpha += star.alphaChange
        if (star.alpha > 1 || star.alpha < 0.3) {
          star.alphaChange = -star.alphaChange
        }

        // Color transition
        if (star.color !== star.targetColor) {
          // Gradually transition to target color
          const transitionFactor = star.colorTransitionSpeed
          star.color = interpolateColor(star.color, star.targetColor, transitionFactor)

          // If colors are very close, set to target and pick a new target
          if (Math.random() < 0.005) {
            star.color = star.targetColor
            star.targetColor = starColors[Math.floor(Math.random() * starColors.length)]
          }
        } else if (Math.random() < 0.002) {
          // Occasionally change target color
          star.targetColor = starColors[Math.floor(Math.random() * starColors.length)]
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed left-0 top-0 h-full w-full"
      style={{ background: "linear-gradient(to bottom, #0a0118, #1a0b30)" }}
    />
  )
}
