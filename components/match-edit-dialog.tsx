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
import type { Match } from "@/lib/types"

const formSchema = z.object({
  mapName: z.string().min(1, "Map name is required"),
  team1: z.string().min(1, "Team 1 is required"),
  team2: z.string().min(1, "Team 2 is required"),
  teamScores: z.string().min(1, "Team scores are required"),
  winner: z.enum(["Team 1", "Team 2"]),
})

interface MatchEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: Match
  onSave: (match: Match) => void
}

export default function MatchEditDialog({ open, onOpenChange, match, onSave }: MatchEditDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mapName: "",
      team1: "",
      team2: "",
      teamScores: "",
      winner: "Team 1" as const,
    },
  })

  useEffect(() => {
    if (match) {
      form.reset({
        mapName: match.mapName,
        team1: match.team1,
        team2: match.team2,
        teamScores: match.teamScores,
        winner: match.winner as "Team 1" | "Team 2",
      })
    }
  }, [match, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...match,
      mapName: values.mapName,
      team1: values.team1,
      team2: values.team2,
      teamScores: values.teamScores,
      winner: values.winner,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mapName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team 1 (comma separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team 2 (comma separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamScores"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Scores</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="winner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Winner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select winner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Team 1">Team 1</SelectItem>
                      <SelectItem value="Team 2">Team 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

