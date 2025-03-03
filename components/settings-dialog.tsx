"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: {
    weightMultiplier: number
    useOnlyName: boolean
    showScore: boolean
  }
  onSettingsChange: (settings: {
    weightMultiplier: number
    useOnlyName: boolean
    showScore: boolean
  }) => void
}

const formSchema = z.object({
  weightMultiplier: z.coerce.number().min(1).max(10),
  useOnlyName: z.boolean(),
  showScore: z.boolean(),
})

export default function SettingsDialog({ open, onOpenChange, settings, onSettingsChange }: SettingsDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weightMultiplier: settings.weightMultiplier,
      useOnlyName: settings.useOnlyName,
      showScore: settings.showScore,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        weightMultiplier: settings.weightMultiplier,
        useOnlyName: settings.useOnlyName,
        showScore: settings.showScore,
      })
    }
  }, [form, open, settings])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSettingsChange(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="weightMultiplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Multiplier</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormDescription>Multiplier applied to player weight in skill calculation</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="useOnlyName"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Use Only Player Name</FormLabel>
                    <FormDescription>Show only player names without skill details</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showScore"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show Individual Score</FormLabel>
                    <FormDescription>Display calculated skill score for each player</FormDescription>
                  </div>
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

