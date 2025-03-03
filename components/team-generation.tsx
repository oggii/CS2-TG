"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Player, Match, GeneratedTeams } from "@/lib/types"
import { balanceTeams, advancedBalanceTeams, calculateSkill } from "@/lib/team-balancer"
import { Label } from "@/components/ui/label"
import { Shuffle, Save } from "lucide-react"
import ColorPicker from "@/components/color-picker"

interface TeamGenerationProps {
  players: Player[]
  settings: {
    weightMultiplier: number
    useOnlyName: boolean
    showScore: boolean
  }
  onMatchSaved: (match: Match) => void
}

export default function TeamGeneration({ players, settings, onMatchSaved }: TeamGenerationProps) {
  const [maps, setMaps] = useState<string[]>(["Dust II", "Mirage", "Inferno", "Nuke", "Overpass", "Ancient", "Vertigo"])
  const [selectedMap, setSelectedMap] = useState<string>("")
  const [newMap, setNewMap] = useState<string>("")
  const [balancingMethod, setBalancingMethod] = useState<string>("basic")
  const [filterOption, setFilterOption] = useState<string>("with-filter")
  const [team1Color, setTeam1Color] = useState<string>("#ff0000")
  const [team2Color, setTeam2Color] = useState<string>("#0000ff")
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeams | null>(null)
  const [team1ColorPickerOpen, setTeam1ColorPickerOpen] = useState(false)
  const [team2ColorPickerOpen, setTeam2ColorPickerOpen] = useState(false)

  const addMap = () => {
    if (newMap.trim() && !maps.includes(newMap.trim())) {
      setMaps([...maps, newMap.trim()])
      setNewMap("")
    }
  }

  const removeMap = () => {
    if (selectedMap && maps.length > 1) {
      setMaps(maps.filter((map) => map !== selectedMap))
      setSelectedMap(maps[0] !== selectedMap ? maps[0] : maps[1])
    }
  }

  const generateTeams = () => {
    if (players.length < 2) {
      alert("At least 2 players are required to generate teams")
      return
    }

    if (!selectedMap) {
      // Select a random map if none is selected
      const randomMap = maps[Math.floor(Math.random() * maps.length)]
      setSelectedMap(randomMap)
    }

    let balanced: GeneratedTeams

    if (settings.useOnlyName) {
      // Random shuffle without considering skills
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)
      const midpoint = Math.ceil(shuffledPlayers.length / 2)
      balanced = {
        team1: shuffledPlayers.slice(0, midpoint),
        team2: shuffledPlayers.slice(midpoint),
        team1Score: 0,
        team2Score: 0,
        balance: 0,
      }
    } else {
      switch (balancingMethod) {
        case "advanced":
          balanced = advancedBalanceTeams(players, settings.weightMultiplier)
          break
        case "random":
          const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)
          const midpoint = Math.ceil(shuffledPlayers.length / 2)
          const team1 = shuffledPlayers.slice(0, midpoint)
          const team2 = shuffledPlayers.slice(midpoint)
          const team1Score = team1.reduce((sum, p) => sum + calculateSkill(p, settings.weightMultiplier), 0)
          const team2Score = team2.reduce((sum, p) => sum + calculateSkill(p, settings.weightMultiplier), 0)
          balanced = {
            team1,
            team2,
            team1Score,
            team2Score,
            balance: Math.abs(team1Score - team2Score),
          }
          break
        default: // basic
          balanced = balanceTeams(players, settings.weightMultiplier)
          break
      }
    }

    setGeneratedTeams(balanced)
  }

  const rebalanceTeams = () => {
    if (generatedTeams) {
      const allPlayers = [...generatedTeams.team1, ...generatedTeams.team2]
      generateTeams()
    }
  }

  const swapPlayer = (player: Player) => {
    if (!generatedTeams) return

    const isInTeam1 = generatedTeams.team1.some((p) => p.id === player.id)

    if (isInTeam1) {
      const newTeam1 = generatedTeams.team1.filter((p) => p.id !== player.id)
      const newTeam2 = [...generatedTeams.team2, player]

      const team1Score = newTeam1.reduce((sum, p) => sum + calculateSkill(p, settings.weightMultiplier), 0)
      const team2Score = newTeam2.reduce((sum, p) => sum + calculateSkill(p, settings.weightMultiplier), 0)

      setGeneratedTeams({
        team1: newTeam1,
        team2: newTeam2,
        team1Score,
        team2Score,
        balance: Math.abs(team1Score - team2Score),
      })
    } else {
      const newTeam2 = generatedTeams.team2.filter((p) => p.id !== player.id)
      const newTeam1 = [...generatedTeams.team1, player]

      const team1Score = newTeam1.reduce((sum, p) => sum + calculateSkill(p, settings.weightMultiplier), 0)
      const team2Score = newTeam2.reduce((sum, p) => sum + calculateSkill(p, settings.weightMultiplier), 0)

      setGeneratedTeams({
        team1: newTeam1,
        team2: newTeam2,
        team1Score,
        team2Score,
        balance: Math.abs(team1Score - team2Score),
      })
    }
  }

  const saveMatch = () => {
    if (!generatedTeams || !selectedMap) return

    const winner = prompt("Which team won? (Enter 'Team 1' or 'Team 2')")
    if (winner !== "Team 1" && winner !== "Team 2") return

    const newMatch: Match = {
      id: Date.now(),
      timestamp: new Date(),
      mapName: selectedMap,
      team1: generatedTeams.team1.map((p) => p.name).join(", "),
      team2: generatedTeams.team2.map((p) => p.name).join(", "),
      teamScores: `Team 1: ${generatedTeams.team1Score}, Team 2: ${generatedTeams.team2Score}`,
      winner,
    }

    onMatchSaved(newMatch)
    setGeneratedTeams(null)
  }

  const renderPlayerItem = (player: Player, teamColor: string) => {
    if (settings.useOnlyName) {
      return (
        <div className="py-1" key={player.id}>
          {player.name}
        </div>
      )
    }

    if (filterOption === "with-filter") {
      if (settings.showScore) {
        const score = calculateSkill(player, settings.weightMultiplier)
        return (
          <div className="py-1" key={player.id}>
            {player.name} [Score: {score}] (Weight: {player.weight}, Aim: {player.aim}, GS: {player.gameSense})
          </div>
        )
      } else {
        return (
          <div className="py-1" key={player.id}>
            {player.name} (Weight: {player.weight}, Aim: {player.aim}, GS: {player.gameSense})
          </div>
        )
      }
    } else {
      return (
        <div className="py-1" key={player.id}>
          {player.name}
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="map-select">Map Selection</Label>
                <div className="flex space-x-2">
                  <Select value={selectedMap} onValueChange={setSelectedMap}>
                    <SelectTrigger id="map-select" className="flex-1">
                      <SelectValue placeholder="Select a map" />
                    </SelectTrigger>
                    <SelectContent>
                      {maps.map((map) => (
                        <SelectItem key={map} value={map}>
                          {map}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={removeMap}>
                    Remove
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add new map"
                  value={newMap}
                  onChange={(e) => setNewMap(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addMap}>Add Map</Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balancing-method">Balancing Method</Label>
                <Select value={balancingMethod} onValueChange={setBalancingMethod}>
                  <SelectTrigger id="balancing-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (With Player Values)</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="random">Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-option">Display Option</Label>
                <Select value={filterOption} onValueChange={setFilterOption}>
                  <SelectTrigger id="filter-option">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with-filter">Show Player Details</SelectItem>
                    <SelectItem value="no-filter">Names Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Team 1 Color</Label>
                  <div
                    className="h-10 rounded-md border border-input mt-2 cursor-pointer"
                    style={{ backgroundColor: team1Color }}
                    onClick={() => setTeam1ColorPickerOpen(true)}
                  />
                </div>
                <div>
                  <Label>Team 2 Color</Label>
                  <div
                    className="h-10 rounded-md border border-input mt-2 cursor-pointer"
                    style={{ backgroundColor: team2Color }}
                    onClick={() => setTeam2ColorPickerOpen(true)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={generateTeams} className="w-full">
                  Generate Teams
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {generatedTeams ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Map: {selectedMap}</h3>

                <div>
                  <h4 className="font-medium mb-2" style={{ color: team1Color }}>
                    Team 1
                  </h4>
                  <div className="space-y-1 pl-4">
                    {generatedTeams.team1.map((player) => (
                      <div
                        key={player.id}
                        className="cursor-pointer hover:bg-muted p-1 rounded"
                        onClick={() => swapPlayer(player)}
                      >
                        {renderPlayerItem(player, team1Color)}
                      </div>
                    ))}
                  </div>
                  {generatedTeams.team1Score !== 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Score:</span> {generatedTeams.team1Score}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2" style={{ color: team2Color }}>
                    Team 2
                  </h4>
                  <div className="space-y-1 pl-4">
                    {generatedTeams.team2.map((player) => (
                      <div
                        key={player.id}
                        className="cursor-pointer hover:bg-muted p-1 rounded"
                        onClick={() => swapPlayer(player)}
                      >
                        {renderPlayerItem(player, team2Color)}
                      </div>
                    ))}
                  </div>
                  {generatedTeams.team2Score !== 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Score:</span> {generatedTeams.team2Score}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="mb-2">
                    <span className="font-medium">Team Balance:</span> {generatedTeams.balance}
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={rebalanceTeams} variant="outline">
                      <Shuffle className="mr-2 h-4 w-4" />
                      Remix Teams
                    </Button>
                    <Button onClick={saveMatch}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Match
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Generate teams to see them here</div>
            )}
          </CardContent>
        </Card>
      </div>

      <ColorPicker
        open={team1ColorPickerOpen}
        onOpenChange={setTeam1ColorPickerOpen}
        color={team1Color}
        onColorChange={setTeam1Color}
        title="Team 1 Color"
      />

      <ColorPicker
        open={team2ColorPickerOpen}
        onOpenChange={setTeam2ColorPickerOpen}
        color={team2Color}
        onColorChange={setTeam2Color}
        title="Team 2 Color"
      />
    </div>
  )
}

