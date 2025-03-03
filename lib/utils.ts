import type { Player } from "./types"

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatPlayerText(player: Player, showScore = false, weightMultiplier = 2): string {
  if (showScore) {
    const score = calculatePlayerSkill(player, weightMultiplier)
    return `${player.name} [Score: ${score}] (Weight: ${player.weight}, Aim: ${player.aim}, Game Sense: ${player.gameSense})`
  } else {
    return `${player.name} (Weight: ${player.weight}, Aim: ${player.aim}, Game Sense: ${player.gameSense})`
  }
}

export function calculatePlayerSkill(player: Player, weightMultiplier: number): number {
  const aimValues = { weak: 1, average: 2, strong: 3 }
  const gameSenseValues = { weak: 1, average: 2, strong: 3 }

  return (
    player.weight * weightMultiplier +
    aimValues[player.aim as keyof typeof aimValues] +
    gameSenseValues[player.gameSense as keyof typeof gameSenseValues]
  )
}

export const cn = (...inputs: (string | undefined)[]) => {
  return inputs.filter(Boolean).join(" ")
}

