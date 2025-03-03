"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Player } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, StarOff, UserPlus } from "lucide-react"
import PlayerDialog from "@/components/player-dialog"
import { calculateSkill } from "@/lib/team-balancer"

interface PlayerManagementProps {
  players: Player[]
  setPlayers: (players: Player[]) => void
}

export default function PlayerManagement({ players, setPlayers }: PlayerManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  const handleAddPlayer = () => {
    setCurrentPlayer(null)
    setDialogOpen(true)
  }

  const handleEditPlayer = (player: Player) => {
    setCurrentPlayer(player)
    setDialogOpen(true)
  }

  const handleDeletePlayer = (id: number) => {
    if (confirm("Are you sure you want to delete this player?")) {
      setPlayers(players.filter((player) => player.id !== id))
    }
  }

  const handleSavePlayer = (player: Player) => {
    if (currentPlayer) {
      // Edit existing player
      setPlayers(players.map((p) => (p.id === player.id ? player : p)))
    } else {
      // Add new player
      const newId = players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1
      setPlayers([...players, { ...player, id: newId }])
    }
    setDialogOpen(false)
  }

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const sortPlayersBySkill = () => {
    const sortedPlayers = [...players].sort((a, b) => calculateSkill(b, 2) - calculateSkill(a, 2))
    setPlayers(sortedPlayers)
  }

  const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={handleAddPlayer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Player
          </Button>
          <Button variant="outline" onClick={sortPlayersBySkill}>
            Sort by Skill
          </Button>
        </div>
        <Input
          placeholder="Search players..."
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
                <TableHead>Name</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Aim</TableHead>
                <TableHead>Game Sense</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No players found. Add some players to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlayers.map((player) => (
                  <TableRow key={player.id} className={favorites.includes(player.id) ? "bg-yellow-500/10" : ""}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.weight}</TableCell>
                    <TableCell>{player.aim}</TableCell>
                    <TableCell>{player.gameSense}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPlayer(player)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePlayer(player.id)}>Delete</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFavorite(player.id)}>
                            {favorites.includes(player.id) ? (
                              <>
                                <StarOff className="mr-2 h-4 w-4" />
                                Remove Favorite
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                Mark as Favorite
                              </>
                            )}
                          </DropdownMenuItem>
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

      <div className="text-sm text-muted-foreground">Total Players: {players.length}</div>

      <PlayerDialog open={dialogOpen} onOpenChange={setDialogOpen} player={currentPlayer} onSave={handleSavePlayer} />
    </div>
  )
}

