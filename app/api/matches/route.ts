import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const matches = await db.match.findMany({
      orderBy: {
        timestamp: "desc",
      },
    })
    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mapName, team1, team2, teamScores, winner } = body

    if (!mapName || !team1 || !team2 || !teamScores || !winner) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const match = await db.match.create({
      data: {
        mapName,
        team1,
        team2,
        teamScores,
        winner,
      },
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 })
  }
}

