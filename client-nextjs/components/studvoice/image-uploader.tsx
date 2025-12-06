"use client"

import type React from "react"

import { useState } from "react"
import { ImageTransition } from "./image-transition"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ImageUploader() {
  const [lightImage, setLightImage] = useState<string | null>(null)
  const [darkImage, setDarkImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, mode: "light" | "dark") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (mode === "light") {
          setLightImage(e.target?.result as string)
        } else {
          setDarkImage(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <div className="w-full md:w-1/2">
          <Label htmlFor="lightImage" className="block mb-2 text-sm font-medium">
            Изображение за светла тема
          </Label>
          <Input
            type="file"
            id="lightImage"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "light")}
            className="cursor-pointer"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Label htmlFor="darkImage" className="block mb-2 text-sm font-medium">
            Изображение за тъмна тема
          </Label>
          <Input
            type="file"
            id="darkImage"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "dark")}
            className="cursor-pointer"
          />
        </div>
      </div>
      {lightImage && darkImage && <ImageTransition lightImage={lightImage} darkImage={darkImage} />}
    </div>
  )
}
