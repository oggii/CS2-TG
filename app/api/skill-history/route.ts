import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const skillHistory = await db.skillHistory.findMany({
      orderBy: {
        timestamp: "desc",
      },
    })
    return NextResponse.json(skillHistory)
  } catch (error) {
    console.error("Error fetching skill history:", error)
    return NextResponse.json({ error: "Failed to fetch skill history" }, { status: 500 })
  }
}

