"use client"

import { ReactNode, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleCardProps {
  title: string
  content: ReactNode;
}

export default function CollapsibleCard({ title, content }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="font-sans overflow-hidden rounded-lg border border-purple-400/30 bg-purple-900/30 shadow-md backdrop-blur-sm">
      <button
        className="font-sans flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-purple-800/30"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="font-sans text-lg font-medium text-pink-200">{title}</h3>
        <ChevronDown
          className={cn("h-5 w-5 text-pink-300 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-t border-purple-400/20 bg-purple-950/30 px-4 py-3">
          <p className="text-pink-100/90 italic text-center">{content}</p>
        </div>
      </div>
    </div>
  )
}
