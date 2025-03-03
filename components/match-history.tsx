"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Match } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileDown, Eye } from "lucide-react"
import MatchDetailsDialog from "@/components/match-details-dialog"
import MatchEditDialog from "@/components/match-edit-dialog"

interface MatchHistoryProps {
  matches: Match[]
  setMatches: (matches: Match[]) => void
}

export default function MatchHistory({ matches, setMatches }: MatchHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const handleViewDetails = (match: Match) => {
    setSelectedMatch(match)
    setDetailsOpen(true)
  }

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match)
    setEditOpen(true)
  }

  const handleDeleteMatch = (id: number) => {
    if (confirm("Are you sure you want to delete this match?")) {
      setMatches(matches.filter((match) => match.id !== id))
    }
  }

  const handleSaveMatch = (updatedMatch: Match) => {
    setMatches(matches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)))
    setEditOpen(false)
  }

  const exportMatchHistory = () => {
    if (matches.length === 0) {
      alert("No matches to export")
      return
    }

    const headers = ["ID", "Date", "Map", "Team 1", "Team 2", "Team Scores", "Winner"]
    const csvContent = [
      headers.join(","),
      ...matches.map((m) =>
        [m.id, formatDate(m.timestamp), m.mapName, `"${m.team1}"`, `"${m.team2}"`, `"${m.teamScores}"`, m.winner].join(
          ",",
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "match_history.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredMatches = matches.filter((match) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      match.mapName.toLowerCase().includes(searchLower) ||
      formatDate(match.timestamp).toLowerCase().includes(searchLower) ||
      match.team1.toLowerCase().includes(searchLower) ||
      match.team2.toLowerCase().includes(searchLower) ||
      match.winner.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button onClick={exportMatchHistory} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export Match History
        </Button>
        <Input
          placeholder="Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Map</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No matches found. Play some games to see match history.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMatches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{formatDate(match.timestamp)}</TableCell>
                    <TableCell>{match.mapName}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        Team 1: {match.team1.split(", ").slice(0, 2).join(", ")}
                        {match.team1.split(", ").length > 2 ? "..." : ""}
                      </div>
                      <div className="max-w-xs truncate">
                        Team 2: {match.team2.split(", ").slice(0, 2).join(", ")}
                        {match.team2.split(", ").length > 2 ? "..." : ""}
                      </div>
                    </TableCell>
                    <TableCell>{match.winner}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(match)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMatch(match)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteMatch(match.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedMatch && (
        <>
          <MatchDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} match={selectedMatch} />
          <MatchEditDialog open={editOpen} onOpenChange={setEditOpen} match={selectedMatch} onSave={handleSaveMatch} />
        </>
      )}
    </div>
  )
}

