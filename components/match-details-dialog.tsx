"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Match } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface MatchDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: Match
}

export default function MatchDetailsDialog({ open, onOpenChange, match }: MatchDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Match Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Map</h3>
            <p>{match.mapName}</p>
          </div>
          <div>
            <h3 className="font-medium">Date</h3>
            <p>{formatDate(match.timestamp)}</p>
          </div>
          <div>
            <h3 className="font-medium">Team 1</h3>
            <p>{match.team1}</p>
          </div>
          <div>
            <h3 className="font-medium">Team 2</h3>
            <p>{match.team2}</p>
          </div>
          <div>
            <h3 className="font-medium">Team Scores</h3>
            <p>{match.teamScores}</p>
          </div>
          <div>
            <h3 className="font-medium">Winner</h3>
            <p>{match.winner}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

