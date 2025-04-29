"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react"

interface EnvelopeModalProps {
  image: string
  message: string
  title: string
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  currentIndex: number
  totalCards: number
}

export default function EnvelopeModal({
  image,
  message,
  title,
  onClose,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
}: EnvelopeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"" | "left" | "right">("")
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Minimum distance required for a swipe
  const minSwipeDistance = 50

  useEffect(() => {
    // Trigger open animation after component mounts
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Reset slide direction after animation completes
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => {
        setSlideDirection("")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [slideDirection])

  const handleClose = () => {
    setIsOpen(false)
    // Wait for close animation to finish
    setTimeout(onClose, 500)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setSlideDirection("left")
      setTimeout(() => onNext(), 250)
    } else if (isRightSwipe) {
      setSlideDirection("right")
      setTimeout(() => onPrevious(), 250)
    }

    // Reset values
    touchStartX.current = null
    touchEndX.current = null
  }

  // Mouse swipe handling for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current) {
      touchEndX.current = e.clientX
    }
  }

  const handleMouseUp = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setSlideDirection("left")
      setTimeout(() => onNext(), 250)
    } else if (isRightSwipe) {
      setSlideDirection("right")
      setTimeout(() => onPrevious(), 250)
    }

    // Reset values
    touchStartX.current = null
    touchEndX.current = null
  }

  const handleMouseLeave = () => {
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className={`relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-b from-purple-900/90 to-pink-900/90 p-5 shadow-xl transition-all duration-500 sm:p-6 ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
          } ${slideDirection === "left" ? "animate-slide-left" : slideDirection === "right" ? "animate-slide-right" : ""
          }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-pink-200 hover:bg-pink-900/50 hover:text-white"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Title */}
        <h2 className="mb-4 text-center font-sans text-2xl font-bold text-pink-200">{title}</h2>

        {/* Image */}
        <div className="relative mx-auto mb-5 aspect-square w-full max-w-[250px] overflow-hidden rounded-lg border-2 border-pink-300 shadow-lg">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>

        {/* Message */}
        <div className="relative rounded-lg bg-purple-950/50 p-4 text-center">
          <Heart className="absolute -right-2 -top-2 h-6 w-6 text-pink-400" fill="#f472b6" />
          <p className="text-sm font-medium leading-relaxed text-pink-100">{message}</p>
        </div>

        {/* Navigation indicators */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
          {Array.from({ length: totalCards }).map((_, index) => (
            <div
              key={index}
              className={`rounded-full ${index === currentIndex ? "bg-pink-400" : "bg-pink-400/30"
                }`}
              style={{
                width: `${Math.max(4, 200 / totalCards)}px`, // Dinámico: mínimo 4px
                height: `${Math.max(4, 200 / totalCards)}px`,
              }}
            />
          ))}
        </div>


        {/* Navigation buttons */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSlideDirection("right")
              setTimeout(() => onPrevious(), 250)
            }}
            className="text-pink-200 hover:bg-pink-900/30 hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleClose}
            className="border-pink-400 bg-transparent text-pink-200 hover:bg-pink-900/30 hover:text-white"
          >
            Regresar
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSlideDirection("left")
              setTimeout(() => onNext(), 250)
            }}
            className="text-pink-200 hover:bg-pink-900/30 hover:text-white"
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        {/* Floating hearts decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-400 opacity-30"
              fill="#f472b6"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animation: `floatHeart ${Math.random() * 5 + 5}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes slideLeft {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes slideRight {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-slide-left {
          animation: slideLeft 0.5s ease-in-out;
        }

        .animate-slide-right {
          animation: slideRight 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
