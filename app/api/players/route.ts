import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const players = await db.player.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return NextResponse.json(players)
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, weight, aim, gameSense, avatar } = body

    if (!name || !weight || !aim || !gameSense) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingPlayer = await db.player.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    })

    if (existingPlayer) {
      return NextResponse.json({ error: "Player with this name already exists" }, { status: 409 })
    }

    const player = await db.player.create({
      data: {
        name,
        weight,
        aim,
        gameSense,
        avatar: avatar || null,
      },
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error("Error creating player:", error)
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 })
  }
}

