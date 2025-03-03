"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Player, Match } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdvancedMetricsProps {
  matches: Match[]
  players: Player[]
}

export default function AdvancedMetrics({ matches, players }: AdvancedMetricsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Performance trends calculation
  const playerStats = useMemo(() => {
    const stats: Record<string, { played: number; wins: number }> = {}

    matches.forEach((match) => {
      const team1Players = match.team1.split(", ")
      const team2Players = match.team2.split(", ")
      ;[...team1Players, ...team2Players].forEach((playerName) => {
        if (!stats[playerName]) {
          stats[playerName] = { played: 0, wins: 0 }
        }
        stats[playerName].played += 1

        if (match.winner === "Team 1" && team1Players.includes(playerName)) {
          stats[playerName].wins += 1
        } else if (match.winner === "Team 2" && team2Players.includes(playerName)) {
          stats[playerName].wins += 1
        }
      })
    })

    return Object.entries(stats).map(([name, { played, wins }]) => ({
      name,
      played,
      wins,
      winRate: played > 0 ? (wins / played) * 100 : 0,
    }))
  }, [matches])

  // Partner synergy calculation
  const partnerSynergy = useMemo(() => {
    const pairStats: Record<string, { together: number; wins: number }> = {}

    matches.forEach((match) => {
      const team1Players = match.team1.split(", ")
      const team2Players = match.team2.split(", ")

      // Process team 1 pairs
      for (let i = 0; i < team1Players.length; i++) {
        for (let j = i + 1; j < team1Players.length; j++) {
          const pair = [team1Players[i], team1Players[j]].sort().join(" & ")
          if (!pairStats[pair]) {
            pairStats[pair] = { together: 0, wins: 0 }
          }
          pairStats[pair].together += 1
          if (match.winner === "Team 1") {
            pairStats[pair].wins += 1
          }
        }
      }

      // Process team 2 pairs
      for (let i = 0; i < team2Players.length; i++) {
        for (let j = i + 1; j < team2Players.length; j++) {
          const pair = [team2Players[i], team2Players[j]].sort().join(" & ")
          if (!pairStats[pair]) {
            pairStats[pair] = { together: 0, wins: 0 }
          }
          pairStats[pair].together += 1
          if (match.winner === "Team 2") {
            pairStats[pair].wins += 1
          }
        }
      }
    })

    return Object.entries(pairStats)
      .filter(([_, { together }]) => together >= 2) // Only pairs that played together at least twice
      .map(([pair, { together, wins }]) => ({
        pair,
        together,
        wins,
        winRate: (wins / together) * 100,
      }))
      .sort((a, b) => b.winRate - a.winRate)
  }, [matches])

  // Filter based on search term
  const filteredPlayerStats = playerStats.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPartnerSynergy = partnerSynergy.filter((item) =>
    item.pair.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Input
          placeholder="Search metrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="synergy">Partner Synergy</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Player Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Wins</TableHead>
                    <TableHead>Win Rate (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayerStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No player statistics available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlayerStats.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell>{stat.name}</TableCell>
                        <TableCell>{stat.played}</TableCell>
                        <TableCell>{stat.wins}</TableCell>
                        <TableCell>{stat.winRate.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synergy">
          <Card>
            <CardHeader>
              <CardTitle>Partner Synergy</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player Pair</TableHead>
                    <TableHead>Played Together</TableHead>
                    <TableHead>Wins</TableHead>
                    <TableHead>Win Rate (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartnerSynergy.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No synergy data available. Players need to play together in at least 2 matches.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartnerSynergy.map((synergy, index) => (
                      <TableRow key={index}>
                        <TableCell>{synergy.pair}</TableCell>
                        <TableCell>{synergy.together}</TableCell>
                        <TableCell>{synergy.wins}</TableCell>
                        <TableCell>{synergy.winRate.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

