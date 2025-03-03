import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const maps = await db.map.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return NextResponse.json(maps.map((map) => map.name))
  } catch (error) {
    console.error("Error fetching maps:", error)
    return NextResponse.json({ error: "Failed to fetch maps" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Map name is required" }, { status: 400 })
    }

    const existingMap = await db.map.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    })

    if (existingMap) {
      return NextResponse.json({ error: "Map with this name already exists" }, { status: 409 })
    }

    const map = await db.map.create({
      data: {
        name,
      },
    })

    return NextResponse.json(map, { status: 201 })
  } catch (error) {
    console.error("Error creating map:", error)
    return NextResponse.json({ error: "Failed to create map" }, { status: 500 })
  }
}

