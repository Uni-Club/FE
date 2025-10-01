export interface User {
  id: string
  email: string
  name: string
  university?: string
  created_at: string
}

export interface Club {
  id: string
  name: string
  description?: string
  university: string
  created_by: string
  created_at: string
}

export interface ClubMember {
  id: string
  club_id: string
  user_id: string
  role: "admin" | "member" | "pending"
  joined_at: string
}

export interface Event {
  id: string
  club_id: string
  title: string
  description?: string
  event_date: string
  location?: string
  created_by: string
  created_at: string
}

export interface Attendance {
  id: string
  event_id: string
  user_id: string
  status: "present" | "absent" | "pending"
  check_in_code?: string
  checked_in_at?: string
}

export interface FinancialAccount {
  id: string
  club_id: string
  name: string
  balance: number
  created_at: string
}

export interface Transaction {
  id: string
  account_id: string
  type: "income" | "expense"
  amount: number
  description: string
  category?: string
  receipt_url?: string
  created_by: string
  created_at: string
}

export interface MemberDues {
  id: string
  club_id: string
  user_id: string
  amount: number
  status: "paid" | "pending" | "overdue"
  due_date: string
  paid_at?: string
  created_at: string
}

export interface InvitationLink {
  id: string
  club_id: string
  code: string
  expires_at?: string
  max_uses?: number
  current_uses: number
  created_by: string
  created_at: string
}
