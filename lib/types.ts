// 사용자 타입
export interface User {
  userId: number;
  email: string;
  name: string;
  phone?: string;
  studentId?: string;
  school?: School;
  createdAt: string;
}

// 학교 타입
export interface School {
  schoolId: number;
  schoolName: string;
  campusName?: string;
  region?: string;
  domain?: string;
  groupCount?: number;
  userCount?: number;
  createdAt?: string;
}

// 동아리 타입
export interface Group {
  groupId: number;
  groupName: string;
  description?: string;
  leader: {
    userId: number;
    name: string;
    email?: string;
  };
  school?: School;
  memberCount: number;
  isUnion: boolean;
  boards?: Board[];
  activeRecruitmentCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// 동아리 멤버 타입
export interface GroupMember {
  memberId: number;
  user: User;
  role: string; // 회장, 부회장, 관리자, 부원
  isFinanceAdmin: boolean;
  joinedAt: string;
}

// 탈퇴 신청 타입
export interface LeaveRequest {
  requestId: number;
  group: {
    groupId: number;
    groupName: string;
  };
  user: User;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reviewer?: User;
  reviewNote?: string;
  requestedAt: string;
  reviewedAt?: string;
}

// 모집공고 타입
export interface Recruitment {
  recruitmentId: number;
  group: Group;
  school?: School;
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  applyStart: string;
  applyEnd: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  capacity?: number;
  applicantCount?: number;
  views: number;
  isUnion: boolean;
  customFields?: CustomField[];
  createdBy: User;
  createdAt: string;
  updatedAt?: string;
}

// 커스텀 필드 타입
export interface CustomField {
  fieldName: string;
  fieldType: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  options?: string[];
}

// 지원서 타입
export interface Application {
  applicationId: number;
  recruitment: Recruitment;
  group: Group;
  applicant: User;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  motivation?: string;
  answers?: FieldAnswer[];
  reviewer?: User;
  reviewNote?: string;
  appliedAt: string;
  decidedAt?: string;
}

// 필드 답변 타입
export interface FieldAnswer {
  fieldName: string;
  value: string | string[];
}

// 게시판 타입
export interface Board {
  boardId: number;
  group: Group;
  name: string;
  boardType: 'NOTICE' | 'FREE' | 'QNA';
  visibility: 'PUBLIC' | 'GROUP_ONLY';
  postCount?: number;
  createdAt: string;
}

// 게시글 타입
export interface Post {
  postId: number;
  board: Board;
  group: Group;
  author: User;
  title: string;
  content?: string;
  isNotice: boolean;
  isPinned: boolean;
  pinnedUntil?: string;
  viewCount?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// 일정 타입
export interface Schedule {
  scheduleId: number;
  group: Group;
  title: string;
  description?: string;
  date: string;
  createdBy: User;
  createdAt: string;
}
