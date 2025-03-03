export interface Player {
  id: number
  name: string
  weight: number
  aim: string
  gameSense: string
  avatar?: string
}

export interface SkillHistoryRecord {
  id: number
  playerId: number
  playerName?: string
  oldWeight: number
  newWeight: number
  oldAim: string
  newAim: string
  oldGameSense: string
  newGameSense: string
  timestamp: Date
}

export interface Match {
  id: number
  timestamp: Date
  mapName: string
  team1: string
  team2: string
  teamScores: string
  winner: string
}

export interface GeneratedTeams {
  team1: Player[]
  team2: Player[]
  team1Score: number
  team2Score: number
  balance: number
}

