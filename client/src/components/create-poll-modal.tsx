"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Loader2 } from "lucide-react"

interface CreatePollModalProps {
  onSubmit: (question: string, options: string[]) => Promise<void>
  trigger?: React.ReactNode
}

export function CreatePollModal({ onSubmit, trigger }: CreatePollModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    const validOptions = options.filter((o) => o.trim())
    if (!question.trim() || validOptions.length < 2) return

    setIsLoading(true)
    await onSubmit(question, validOptions)
    setIsLoading(false)
    setQuestion("")
    setOptions(["", ""])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Създай анкета</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Създаване на нова анкета</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poll-question">Въпрос</Label>
            <Input
              id="poll-question"
              placeholder="Какво искате да попитате?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Опции</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Опция ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    disabled={isLoading}
                  />
                  {options.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} disabled={isLoading}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                disabled={isLoading}
                className="mt-2 bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добави опция
              </Button>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !question.trim() || options.filter((o) => o.trim()).length < 2}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Създай анкета
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
