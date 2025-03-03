"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlayerManagement from "@/components/player-management"
import TeamGeneration from "@/components/team-generation"
import MatchHistory from "@/components/match-history"
import SkillHistory from "@/components/skill-history"
import AdvancedMetrics from "@/components/advanced-metrics"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type { Player, Match, SkillHistoryRecord } from "@/lib/types"
import SettingsDialog from "@/components/settings-dialog"
import BalancingInfoDialog from "@/components/balancing-info-dialog"

export default function TeamGenerator() {
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [skillHistory, setSkillHistory] = useState<SkillHistoryRecord[]>([])
  const [settings, setSettings] = useState({
    weightMultiplier: 2,
    useOnlyName: false,
    showScore: false,
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [balancingInfoOpen, setBalancingInfoOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">CS2 Team Generator</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={() => setBalancingInfoOpen(true)}>
            Balancing Explanation
          </Button>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="team-generation" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="player-management">Players</TabsTrigger>
          <TabsTrigger value="team-generation">Team Generation</TabsTrigger>
          <TabsTrigger value="match-history">Match History</TabsTrigger>
          <TabsTrigger value="skill-history">Skill History</TabsTrigger>
          <TabsTrigger value="advanced-metrics">Advanced Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="player-management">
          <PlayerManagement players={players} setPlayers={setPlayers} />
        </TabsContent>

        <TabsContent value="team-generation">
          <TeamGeneration
            players={players}
            settings={settings}
            onMatchSaved={(match) => setMatches([match, ...matches])}
          />
        </TabsContent>

        <TabsContent value="match-history">
          <MatchHistory matches={matches} setMatches={setMatches} />
        </TabsContent>

        <TabsContent value="skill-history">
          <SkillHistory skillHistory={skillHistory} />
        </TabsContent>

        <TabsContent value="advanced-metrics">
          <AdvancedMetrics matches={matches} players={players} />
        </TabsContent>
      </Tabs>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <BalancingInfoDialog open={balancingInfoOpen} onOpenChange={setBalancingInfoOpen} settings={settings} />
    </div>
  )
}

