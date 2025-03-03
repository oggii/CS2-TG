"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Player } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.coerce.number().min(1).max(10),
  aim: z.enum(["schwach", "durchschnittlich", "stark"]),
  gameSense: z.enum(["schwach", "durchschnittlich", "stark"]),
  avatar: z.string().optional(),
})

interface PlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  player: Player | null
  onSave: (player: Player) => void
}

export default function PlayerDialog({ open, onOpenChange, player, onSave }: PlayerDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      weight: 5,
      aim: "durchschnittlich" as const,
      gameSense: "durchschnittlich" as const,
      avatar: "",
    },
  })

  useEffect(() => {
    if (player) {
      form.reset({
        name: player.name,
        weight: player.weight,
        aim: player.aim as any,
        gameSense: player.gameSense as any,
        avatar: player.avatar || "",
      })
    } else {
      form.reset({
        name: "",
        weight: 5,
        aim: "durchschnittlich",
        gameSense: "durchschnittlich",
        avatar: "",
      })
    }
  }, [player, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: player?.id || 0,
      name: values.name,
      weight: values.weight,
      aim: values.aim,
      gameSense: values.gameSense,
      avatar: values.avatar,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{player ? "Edit Player" : "Add Player"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Player name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (1-10)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aim Skill</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aim skill" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="schwach">Weak</SelectItem>
                      <SelectItem value="durchschnittlich">Average</SelectItem>
                      <SelectItem value="stark">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gameSense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Sense</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select game sense" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="schwach">Weak</SelectItem>
                      <SelectItem value="durchschnittlich">Average</SelectItem>
                      <SelectItem value="stark">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

