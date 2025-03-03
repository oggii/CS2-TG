"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  color: string
  onColorChange: (color: string) => void
  title: string
}

export default function ColorPicker({ open, onOpenChange, color, onColorChange, title }: ColorPickerProps) {
  const [tempColor, setTempColor] = useState(color)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value)
  }

  const handleSave = () => {
    onColorChange(tempColor)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen) {
          setTempColor(color)
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color-input" className="text-right">
              Color
            </Label>
            <Input
              id="color-input"
              type="color"
              value={tempColor}
              onChange={handleColorChange}
              className="col-span-3 h-10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hex-input" className="text-right">
              Hex
            </Label>
            <Input id="hex-input" value={tempColor} onChange={handleColorChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Preview</Label>
            <div className="col-span-3 h-10 rounded-md border" style={{ backgroundColor: tempColor }} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

