import type { Player, GeneratedTeams } from "@/lib/types"

const SKILL_VALUES = {
  schwach: 1,
  durchschnittlich: 2,
  stark: 3,
}

export function calculateSkill(player: Player, weightMultiplier: number): number {
  return (
    player.weight * weightMultiplier +
    SKILL_VALUES[player.aim as keyof typeof SKILL_VALUES] +
    SKILL_VALUES[player.gameSense as keyof typeof SKILL_VALUES]
  )
}

export function balanceTeams(players: Player[], weightMultiplier: number, attempts = 10): GeneratedTeams {
  let bestSplit: GeneratedTeams | null = null
  let bestDiff: number | null = null

  for (let i = 0; i < attempts; i++) {
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    const team1 = shuffled.filter((_, index) => index % 2 === 0)
    const team2 = shuffled.filter((_, index) => index % 2 === 1)

    const team1Score = team1.reduce((sum, p) => sum + calculateSkill(p, weightMultiplier), 0)
    const team2Score = team2.reduce((sum, p) => sum + calculateSkill(p, weightMultiplier), 0)
    const diff = Math.abs(team1Score - team2Score)

    if (bestSplit === null || diff < bestDiff!) {
      bestSplit = {
        team1,
        team2,
        team1Score,
        team2Score,
        balance: diff,
      }
      bestDiff = diff
    }
  }

  return bestSplit!
}

export function advancedBalanceTeams(players: Player[], weightMultiplier: number, iterations = 100): GeneratedTeams {
  // Start with a random split
  const shuffled = [...players].sort(() => Math.random() - 0.5)
  const midpoint = Math.ceil(shuffled.length / 2)
  let team1 = shuffled.slice(0, midpoint)
  let team2 = shuffled.slice(midpoint)

  let team1Score = team1.reduce((sum, p) => sum + calculateSkill(p, weightMultiplier), 0)
  let team2Score = team2.reduce((sum, p) => sum + calculateSkill(p, weightMultiplier), 0)
  let bestDiff = Math.abs(team1Score - team2Score)

  // Hill climbing algorithm
  for (let iter = 0; iter < iterations; iter++) {
    let improved = false

    for (let i = 0; i < team1.length; i++) {
      for (let j = 0; j < team2.length; j++) {
        // Try swapping players
        const newTeam1 = [...team1]
        const newTeam2 = [...team2]

        // Swap players
        ;[newTeam1[i], newTeam2[j]] = [newTeam2[j], newTeam1[i]]

        const newTeam1Score = newTeam1.reduce((sum, p) => sum + calculateSkill(p, weightMultiplier), 0)
        const newTeam2Score = newTeam2.reduce((sum, p) => sum + calculateSkill(p, weightMultiplier), 0)
        const newDiff = Math.abs(newTeam1Score - newTeam2Score)

        if (newDiff < bestDiff) {
          team1 = newTeam1
          team2 = newTeam2
          team1Score = newTeam1Score
          team2Score = newTeam2Score
          bestDiff = newDiff
          improved = true
          break
        }
      }

      if (improved) break
    }

    // If no improvement was found in this iteration, we're at a local optimum
    if (!improved) break
  }

  return {
    team1,
    team2,
    team1Score,
    team2Score,
    balance: bestDiff,
  }
}

