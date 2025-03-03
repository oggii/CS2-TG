import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const player = await db.player.findUnique({
      where: { id },
    })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error("Error fetching player:", error)
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { name, weight, aim, gameSense, avatar } = body

    if (!name || !weight || !aim || !gameSense) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingPlayer = await db.player.findUnique({
      where: { id },
    })

    if (!existingPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Record skill history if skills changed
    if (existingPlayer.weight !== weight || existingPlayer.aim !== aim || existingPlayer.gameSense !== gameSense) {
      await db.skillHistory.create({
        data: {
          playerId: id,
          playerName: existingPlayer.name,
          oldWeight: existingPlayer.weight,
          newWeight: weight,
          oldAim: existingPlayer.aim,
          newAim: aim,
          oldGameSense: existingPlayer.gameSense,
          newGameSense: gameSense,
        },
      })
    }

    const updatedPlayer = await db.player.update({
      where: { id },
      data: {
        name,
        weight,
        aim,
        gameSense,
        avatar: avatar || null,
      },
    })

    return NextResponse.json(updatedPlayer)
  } catch (error) {
    console.error("Error updating player:", error)
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await db.player.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting player:", error)
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 })
  }
}

