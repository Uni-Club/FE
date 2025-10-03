import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/')) {
      // 인증 관련 API 호출이 아닌 경우에만 로그인 페이지로 리다이렉트
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    studentId?: string;
    schoolId?: number;
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

// User API
export const userAPI = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateMe: async (data: {
    name?: string;
    phone?: string;
    studentId?: string;
    schoolId?: number;
  }) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.put('/users/me/password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

// School API
export const schoolAPI = {
  search: async (keyword?: string) => {
    const params = keyword ? { keyword } : {};
    const response = await api.get('/schools', { params });
    return response.data;
  },
  
  getById: async (schoolId: number) => {
    const response = await api.get(`/schools/${schoolId}`);
    return response.data;
  },
  
  getByRegion: async (region: string) => {
    const response = await api.get(`/schools/region/${region}`);
    return response.data;
  },
};

// Group API
export const groupAPI = {
  search: async (params: {
    keyword?: string;
    schoolId?: number;
    category?: string;
    tags?: string;
  }) => {
    const response = await api.get('/groups/search', { params });
    return response.data;
  },
  
  getById: async (groupId: number) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },
  
  getBySchool: async (schoolId: number) => {
    const response = await api.get(`/groups/school/${schoolId}`);
    return response.data;
  },
  
  // club/[id]/page.tsx에서 사용하는 메서드 추가
  getDetail: async (groupId: number) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },
};

// Recruitment API
export const recruitmentAPI = {
  getByGroup: async (groupId: number) => {
    const response = await api.get(`/recruitments/group/${groupId}`);
    return response.data;
  },
  
  getById: async (recruitmentId: number) => {
    const response = await api.get(`/recruitments/${recruitmentId}`);
    return response.data;
  },
  
  search: async (params?: {
    schoolId?: number;
    status?: string;
    category?: string;
  }) => {
    const response = await api.get('/recruitments/search', { params });
    return response.data;
  },
};

export default api;
