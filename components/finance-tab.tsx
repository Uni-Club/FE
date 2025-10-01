"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Plus, TrendingUp, TrendingDown, Download, Upload, Receipt } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FinanceTabProps {
  clubId: string
  isAdmin: boolean
}

export default function FinanceTab({ clubId, isAdmin }: FinanceTabProps) {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")

  // Mock data
  const account = {
    id: "1",
    name: "동아리 공동 계좌",
    balance: 1250000,
  }

  const transactions = [
    {
      id: "1",
      type: "income",
      amount: 500000,
      description: "학생회 지원금",
      category: "지원금",
      createdBy: "김철수",
      createdAt: "2025-01-10",
      receiptUrl: null,
    },
    {
      id: "2",
      type: "expense",
      amount: 150000,
      description: "정기 모임 식사",
      category: "식비",
      createdBy: "이영희",
      createdAt: "2025-01-08",
      receiptUrl: "/receipt-1.jpg",
    },
    {
      id: "3",
      type: "expense",
      amount: 80000,
      description: "프로젝트 재료비",
      category: "활동비",
      createdBy: "박민수",
      createdAt: "2025-01-05",
      receiptUrl: "/receipt-2.jpg",
    },
    {
      id: "4",
      type: "income",
      amount: 30000,
      description: "회비 - 김철수",
      category: "회비",
      createdBy: "김철수",
      createdAt: "2025-01-03",
      receiptUrl: null,
    },
  ]

  const memberDues = [
    { id: "1", name: "김철수", amount: 30000, status: "paid", dueDate: "2025-01-31", paidAt: "2025-01-03" },
    { id: "2", name: "이영희", amount: 30000, status: "paid", dueDate: "2025-01-31", paidAt: "2025-01-05" },
    { id: "3", name: "박민수", amount: 30000, status: "pending", dueDate: "2025-01-31", paidAt: null },
    { id: "4", name: "정수진", amount: 30000, status: "overdue", dueDate: "2024-12-31", paidAt: null },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR")
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder - will be replaced with actual API call
    setIsAddTransactionOpen(false)
  }

  const handleExportReport = () => {
    // Placeholder - will be replaced with actual Excel export
    alert("엑셀 리포트를 다운로드합니다")
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const paidDues = memberDues.filter((d) => d.status === "paid").length
  const totalDues = memberDues.length

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardDescription>현재 잔액</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-700" />
              <p className="text-3xl font-bold text-blue-700">{formatCurrency(account.balance)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardDescription>총 수입</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-700" />
              <p className="text-3xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardDescription>총 지출</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-700" />
              <p className="text-3xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">재무 관리</CardTitle>
                <CardDescription>거래 내역을 추가하고 리포트를 생성하세요</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExportReport} variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  엑셀 내보내기
                </Button>
                <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-700 hover:bg-blue-800 gap-2">
                      <Plus className="w-4 h-4" />
                      거래 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>새 거래 추가</DialogTitle>
                      <DialogDescription>수입 또는 지출 내역을 입력하세요</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTransaction} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">거래 유형</Label>
                        <Select value={transactionType} onValueChange={(v) => setTransactionType(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">수입</SelectItem>
                            <SelectItem value="expense">지출</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">금액</Label>
                          <Input id="amount" type="number" placeholder="50000" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">카테고리</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {transactionType === "income" ? (
                                <>
                                  <SelectItem value="회비">회비</SelectItem>
                                  <SelectItem value="지원금">지원금</SelectItem>
                                  <SelectItem value="기타">기타</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="식비">식비</SelectItem>
                                  <SelectItem value="활동비">활동비</SelectItem>
                                  <SelectItem value="장비">장비</SelectItem>
                                  <SelectItem value="기타">기타</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">설명</Label>
                        <Textarea id="description" placeholder="거래에 대한 설명을 입력하세요" rows={3} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receipt">영수증 (선택)</Label>
                        <div className="flex items-center gap-2">
                          <Input id="receipt" type="file" accept="image/*" />
                          <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Upload className="w-4 h-4" />
                            업로드
                          </Button>
                        </div>
                        <p className="text-xs text-slate-600">영수증 이미지를 업로드하면 자동으로 정보를 인식합니다</p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setIsAddTransactionOpen(false)}
                        >
                          취소
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-700 hover:bg-blue-800">
                          거래 추가
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Tabs for Transactions and Dues */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="transactions">거래 내역</TabsTrigger>
          <TabsTrigger value="dues">회비 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">거래 내역</CardTitle>
              <CardDescription>모든 수입과 지출 내역을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-green-700" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900">{transaction.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          {transaction.receiptUrl && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Receipt className="w-3 h-3" />
                              영수증
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {transaction.createdBy} · {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "income" ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dues">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">회비 관리</CardTitle>
                  <CardDescription>
                    {paidDues}/{totalDues}명 납부 완료
                  </CardDescription>
                </div>
                {isAdmin && (
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    회비 청구
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberDues.map((due) => (
                  <div
                    key={due.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">{due.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{due.name}</p>
                        <p className="text-sm text-slate-600">
                          마감일: {formatDate(due.dueDate)}
                          {due.paidAt && ` · 납부일: ${formatDate(due.paidAt)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-slate-900">{formatCurrency(due.amount)}</p>
                      {due.status === "paid" ? (
                        <Badge className="bg-green-600 hover:bg-green-600">납부 완료</Badge>
                      ) : due.status === "overdue" ? (
                        <Badge className="bg-red-600 hover:bg-red-600">연체</Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          미납
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
