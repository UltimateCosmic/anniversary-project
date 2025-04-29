"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Sparkles } from "lucide-react"

interface EnvelopeCardProps {
  id: number
  previewImage: string
  title: string
  onOpen: (id: number) => void
}

export default function EnvelopeCard({ id, previewImage, title, onOpen }: EnvelopeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative flex cursor-pointer flex-col items-center justify-center"
      onClick={() => onOpen(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative flex h-40 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-purple-400 bg-gradient-to-b from-purple-900/80 to-pink-900/80 p-3 shadow-lg transition-all duration-500 ease-in-out sm:h-48 sm:w-40 md:h-56 md:w-44 ${
          isHovered ? "scale-105 shadow-purple-500/30" : ""
        }`}
      >
        {/* Envelope flap */}
        <div
          className={`absolute left-0 top-0 h-1/2 w-full origin-bottom bg-gradient-to-b from-purple-800 to-purple-900 transition-all duration-500 ${
            isHovered ? "translate-y-[-98%]" : ""
          }`}
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Preview image */}
        <div
          className={`relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-pink-300 transition-all duration-500 sm:h-20 sm:w-20 ${
            isHovered ? "scale-110 shadow-lg" : ""
          }`}
        >
          <Image src={previewImage || "/placeholder.svg"} alt={title} fill className="object-cover font-sans" />
        </div>

        {/* Title */}
        <h3 className="font-sans mt-2 text-center text-sm font-medium text-pink-100 sm:text-base">{title}</h3>

        {/* Decorative elements */}
        <Heart className="absolute right-1 top-1 h-6 w-6 text-pink-400 opacity-70" fill="#f472b6" />
        <Sparkles className="absolute bottom-1 left-1 h-5 w-5 text-purple-300 opacity-70" />
      </div>

      {/* Floating animation for cards */}
      <style jsx>{`
        .group {
          animation: float ${3 + id * 0.5}s ease-in-out infinite alternate;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
