"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, RefreshCw } from "lucide-react"

interface CheckInSectionProps {
  eventId: string
}

export default function CheckInSection({ eventId }: CheckInSectionProps) {
  const [checkInCode, setCheckInCode] = useState("ABC123")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateCode = () => {
    setIsGenerating(true)
    // Placeholder - will be replaced with actual API call
    setTimeout(() => {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      setCheckInCode(newCode)
      setIsGenerating(false)
    }, 500)
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="w-5 h-5 text-blue-700" />
          출석 체크인
        </CardTitle>
        <CardDescription>멤버들이 이 코드를 입력하여 출석을 체크할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg border-2 border-blue-300 text-center">
              <p className="text-sm text-slate-600 mb-2">출석 코드</p>
              <p className="text-4xl font-bold text-blue-700 tracking-wider">{checkInCode}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleGenerateCode}
          disabled={isGenerating}
          variant="outline"
          className="w-full gap-2 bg-white"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "생성 중..." : "새 코드 생성"}
        </Button>
        <p className="text-xs text-slate-600 text-center">보안을 위해 정기적으로 새 코드를 생성하는 것을 권장합니다</p>
      </CardContent>
    </Card>
  )
}
