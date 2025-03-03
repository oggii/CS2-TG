"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BalancingInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: {
    weightMultiplier: number
    useOnlyName: boolean
    showScore: boolean
  }
}

export default function BalancingInfoDialog({ open, onOpenChange, settings }: BalancingInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Balancing Explanation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {settings.useOnlyName ? (
            <p>When "Use Only Player Name" is enabled, balancing is bypassed and only names are displayed.</p>
          ) : (
            <>
              <div>
                <h3 className="font-medium">Player Skill Calculation</h3>
                <p className="mt-1">
                  Total Score = (Weight × {settings.weightMultiplier}) + (Aim Value) + (Game Sense Value)
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Aim/Game Sense values: weak=1, average=2, strong=3</p>
                <p className="mt-2">
                  Example: (5 × {settings.weightMultiplier}) + 3 + 2 = {5 * settings.weightMultiplier + 3 + 2}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Balancing Methods</h3>
                <ul className="list-disc pl-5 space-y-2 mt-1">
                  <li>
                    <span className="font-medium">Basic:</span> Tries 10 random team combinations and keeps the most
                    balanced result
                  </li>
                  <li>
                    <span className="font-medium">Advanced:</span> Uses a hill-climbing algorithm to optimize team
                    balance through iterative player swaps
                  </li>
                  <li>
                    <span className="font-medium">Random:</span> Randomly assigns players without considering skill
                    balance
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

