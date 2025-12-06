/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, useRef } from "react"

interface ImageTransitionProps {
  lightImage: string
  darkImage: string
}

export function ImageTransition({ lightImage, darkImage }: ImageTransitionProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const handle = handleRef.current

    if (!container || !handle) return

    const onMouseDown = () => {
      setIsDragging(true)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const containerRect = container.getBoundingClientRect()
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
      setPosition(Math.max(0, Math.min(100, newPosition)))
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    const onTouchStart = () => {
      setIsDragging(true)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const containerRect = container.getBoundingClientRect()
      const touch = e.touches[0]
      const newPosition = ((touch.clientX - containerRect.left) / containerRect.width) * 100
      setPosition(Math.max(0, Math.min(100, newPosition)))
    }

    const onTouchEnd = () => {
      setIsDragging(false)
    }

    handle.addEventListener("mousedown", onMouseDown)
    handle.addEventListener("touchstart", onTouchStart)
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("touchmove", onTouchMove)
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("touchend", onTouchEnd)

    return () => {
      handle.removeEventListener("mousedown", onMouseDown)
      handle.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [isDragging])

  return (
    <div
      className="relative w-full h-[80vh] overflow-hidden select-none rounded-xl border border-border"
      ref={containerRef}
    >
      <img
        src={lightImage || "/placeholder.svg"}
        alt="Светла тема"
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
      />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={darkImage || "/placeholder.svg"}
          alt="Тъмна тема"
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />
      </div>
      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize touch-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full shadow-lg flex items-center justify-center text-primary-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-sm font-medium">
        Светла
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-sm font-medium">
        Тъмна
      </div>
    </div>
  )
}
