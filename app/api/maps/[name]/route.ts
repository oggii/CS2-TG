import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { name: string } }) {
  try {
    const name = decodeURIComponent(params.name)

    const map = await db.map.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    })

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 })
    }

    await db.map.delete({
      where: { id: map.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting map:", error)
    return NextResponse.json({ error: "Failed to delete map" }, { status: 500 })
  }
}

