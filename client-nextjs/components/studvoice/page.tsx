"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AMACard } from "@/components/ama/ama-card"
import { CreateAMAModal } from "@/components/ama/create-ama-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const initialAMAs = [
  {
    id: 1,
    host: "Директор Иванов",
    role: "Директор на училището",
    topic: "Планиране на учебната година 2025",
    description: "Питайте ме за предстоящата учебна година, нови програми и подобрения в училището.",
    questionsCount: 23,
    answeredCount: 18,
    isLive: true,
  },
  {
    id: 2,
    host: "Треньор Петров",
    role: "Спортен директор",
    topic: "Обновяване на спортните съоръжения",
    description: "Научете за новото оборудване във фитнеса, предстоящи турнири и разширяване на спортните програми.",
    questionsCount: 15,
    answeredCount: 12,
    isLive: true,
  },
  {
    id: 3,
    host: "Г-жа Георгиева",
    role: "Съветник на ученическия съвет",
    topic: "Ученически дейности и събития",
    description: "Дискусия за предстоящи събития, финансиране на клубове и възможности за ученически организации.",
    questionsCount: 32,
    answeredCount: 28,
    isLive: false,
  },
  {
    id: 4,
    host: "Д-р Димитров",
    role: "Ръководител на катедра по природни науки",
    topic: "Нови STEM програми",
    description:
      "Представяне на нови програми по наука и технологии, обновяване на лаборатории и изследователски възможности.",
    questionsCount: 19,
    answeredCount: 15,
    isLive: false,
  },
]

export default function AMAPage() {
  const [amas, setAMAs] = useState(initialAMAs)

  const handleCreateAMA = async (data: { topic: string; description: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newAMA = {
      id: Date.now(),
      host: "Вие",
      role: "Ученически съвет",
      topic: data.topic,
      description: data.description,
      questionsCount: 0,
      answeredCount: 0,
      isLive: true,
    }

    setAMAs([newAMA, ...amas])
  }

  const liveAMAs = amas.filter((a) => a.isLive)
  const pastAMAs = amas.filter((a) => !a.isLive)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Питай ме каквото искаш</h1>
            <p className="text-muted-foreground mt-1">
              Задавайте въпроси на учители, персонал и членове на ученическия съвет.
            </p>
          </div>
          <CreateAMAModal
            onSubmit={handleCreateAMA}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Създай AMA
              </Button>
            }
          />
        </div>

        {liveAMAs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">На живо</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {liveAMAs.map((ama) => (
                <AMACard key={ama.id} ama={ama} />
              ))}
            </div>
          </div>
        )}

        {pastAMAs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Минали сесии</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastAMAs.map((ama) => (
                <AMACard key={ama.id} ama={ama} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
