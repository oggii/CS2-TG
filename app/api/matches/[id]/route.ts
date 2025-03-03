import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const match = await db.match.findUnique({
      where: { id },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error("Error fetching match:", error)
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { mapName, team1, team2, teamScores, winner } = body

    if (!mapName || !team1 || !team2 || !teamScores || !winner) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingMatch = await db.match.findUnique({
      where: { id },
    })

    if (!existingMatch) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    const updatedMatch = await db.match.update({
      where: { id },
      data: {
        mapName,
        team1,
        team2,
        teamScores,
        winner,
      },
    })

    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error("Error updating match:", error)
    return NextResponse.json({ error: "Failed to update match" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await db.match.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting match:", error)
    return NextResponse.json({ error: "Failed to delete match" }, { status: 500 })
  }
}

