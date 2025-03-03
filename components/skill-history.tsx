"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { SkillHistoryRecord } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SkillHistoryProps {
  skillHistory: SkillHistoryRecord[]
}

export default function SkillHistory({ skillHistory }: SkillHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = skillHistory.filter((record) => {
    const searchLower = searchTerm.toLowerCase()
    return (record.playerName?.toLowerCase() || "").includes(searchLower)
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Input
          placeholder="Search by player name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Old Weight</TableHead>
                <TableHead>New Weight</TableHead>
                <TableHead>Old Aim</TableHead>
                <TableHead>New Aim</TableHead>
                <TableHead>Old Game Sense</TableHead>
                <TableHead>New Game Sense</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No skill history records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.playerName || "Unknown"}</TableCell>
                    <TableCell>{record.oldWeight}</TableCell>
                    <TableCell>{record.newWeight}</TableCell>
                    <TableCell>{record.oldAim}</TableCell>
                    <TableCell>{record.newAim}</TableCell>
                    <TableCell>{record.oldGameSense}</TableCell>
                    <TableCell>{record.newGameSense}</TableCell>
                    <TableCell>{formatDate(record.timestamp)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

