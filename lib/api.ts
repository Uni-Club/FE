// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: string;
  } | null;
  timestamp: string;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API 호출 헬퍼 함수
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// 인증 API
export const authApi = {
  // 회원가입
  signup: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    studentId?: string;
    schoolId?: number;
  }) => fetchApi('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 로그인
  login: (email: string, password: string) =>
    fetchApi<{
      token: string;
      tokenType: string;
      expiresIn: number;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // 로그아웃
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
};

// 사용자 API
export const userApi = {
  // 내 정보 조회
  getMe: () => fetchApi('/users/me'),

  // 내 정보 수정
  updateMe: (data: { name?: string; phone?: string; studentId?: string }) =>
    fetchApi('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 비밀번호 변경
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // 내가 속한 동아리 목록
  getMyGroups: () => fetchApi('/users/me/groups'),

  // 내 지원 내역
  getMyApplications: (status?: string) =>
    fetchApi(`/users/me/applications${status ? `?status=${status}` : ''}`),
};

// 학교 API
export const schoolApi = {
  // 학교 검색
  search: (keyword?: string, region?: string) =>
    fetchApi(`/schools?keyword=${keyword || ''}&region=${region || ''}`),

  // 학교 상세 조회
  getById: (schoolId: number) => fetchApi(`/schools/${schoolId}`),

  // 학교별 동아리 목록
  getGroups: (schoolId: number, params?: { page?: number; size?: number; keyword?: string }) =>
    fetchApi<PageResponse<any>>(
      `/schools/${schoolId}/groups?` +
        new URLSearchParams(params as any).toString()
    ),
};

// 동아리 API
export const groupApi = {
  // 동아리 검색
  search: (params: {
    keyword?: string;
    schoolId?: number;
    isUnion?: boolean;
    page?: number;
    size?: number;
  }) =>
    fetchApi<PageResponse<any>>('/groups?' + new URLSearchParams(params as any).toString()),

  // 동아리 생성
  create: (data: {
    groupName: string;
    description: string;
    schoolId?: number;
    isUnion?: boolean;
  }) =>
    fetchApi('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 동아리 상세 조회
  getById: (groupId: number) => fetchApi(`/groups/${groupId}`),

  // 동아리 수정
  update: (groupId: number, data: { groupName?: string; description?: string }) =>
    fetchApi(`/groups/${groupId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 동아리 삭제
  delete: (groupId: number) =>
    fetchApi(`/groups/${groupId}`, {
      method: 'DELETE',
    }),

  // 동아리 멤버 목록
  getMembers: (groupId: number, role?: string) =>
    fetchApi(`/groups/${groupId}/members${role ? `?role=${role}` : ''}`),

  // 동아리 멤버 추가
  addMember: (groupId: number, userId: number, role: string) =>
    fetchApi(`/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    }),

  // 동아리 멤버 강제 퇴출
  removeMember: (groupId: number, userId: number) =>
    fetchApi(`/groups/${groupId}/members/${userId}`, {
      method: 'DELETE',
    }),

  // 탈퇴 신청
  requestLeave: (groupId: number, reason: string) =>
    fetchApi(`/groups/${groupId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // 탈퇴 신청 목록 조회 (관리자)
  getLeaveRequests: (groupId: number, status?: string) =>
    fetchApi(`/groups/${groupId}/leave-requests${status ? `?status=${status}` : ''}`),

  // 탈퇴 신청 승인
  approveLeaveRequest: (groupId: number, requestId: number, reviewNote?: string) =>
    fetchApi(`/groups/${groupId}/leave-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'APPROVE', reviewNote }),
    }),

  // 탈퇴 신청 거절
  rejectLeaveRequest: (groupId: number, requestId: number, reviewNote?: string) =>
    fetchApi(`/groups/${groupId}/leave-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'REJECT', reviewNote }),
    }),

  // 모집공고 목록
  getRecruitments: (groupId: number, status?: string) =>
    fetchApi(`/groups/${groupId}/recruitments${status ? `?status=${status}` : ''}`),

  // 지원서 목록 (관리자용)
  getApplications: (groupId: number, params?: { status?: string; page?: number; size?: number }) =>
    fetchApi<PageResponse<any>>(
      `/groups/${groupId}/applications?` + new URLSearchParams(params as any).toString()
    ),
};

// 모집공고 API
export const recruitmentApi = {
  // 모집공고 검색
  search: (params: {
    keyword?: string;
    schoolId?: number;
    category?: string;
    status?: string;
    page?: number;
    size?: number;
  }) =>
    fetchApi<PageResponse<any>>('/recruitments?' + new URLSearchParams(params as any).toString()),

  // 모집공고 생성
  create: (data: any) =>
    fetchApi('/recruitments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 모집공고 상세 조회
  getById: (recruitmentId: number) => fetchApi(`/recruitments/${recruitmentId}`),

  // 모집공고 수정
  update: (recruitmentId: number, data: any) =>
    fetchApi(`/recruitments/${recruitmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 모집공고 삭제
  delete: (recruitmentId: number) =>
    fetchApi(`/recruitments/${recruitmentId}`, {
      method: 'DELETE',
    }),

  // 모집공고 상태 변경
  updateStatus: (recruitmentId: number, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED') =>
    fetchApi(`/recruitments/${recruitmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // 지원하기
  apply: (recruitmentId: number, data: { motivation: string; answers: any[] }) =>
    fetchApi(`/recruitments/${recruitmentId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 지원서 API
export const applicationApi = {
  // 지원서 상세 조회
  getById: (applicationId: number) => fetchApi(`/applications/${applicationId}`),

  // 지원서 심사
  review: (applicationId: number, status: 'ACCEPTED' | 'REJECTED', reviewNote?: string) =>
    fetchApi(`/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNote }),
    }),

  // 지원서 취소
  cancel: (applicationId: number) =>
    fetchApi(`/applications/${applicationId}`, {
      method: 'DELETE',
    }),
};

export default {
  auth: authApi,
  user: userApi,
  school: schoolApi,
  group: groupApi,
  recruitment: recruitmentApi,
  application: applicationApi,
};
