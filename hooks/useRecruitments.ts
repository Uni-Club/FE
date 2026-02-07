import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from '@/lib/api';

export interface Recruitment {
  recruitmentId: number;
  title: string;
  content?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  applyStart?: string;
  applyEnd?: string;
  capacity?: number;
  applicantCount?: number;
  views?: number;
  group?: {
    groupId: number;
    groupName: string;
    school?: {
      schoolId: number;
      schoolName: string;
    };
  };
  questions?: Array<{
    questionId: number;
    question: string;
    isRequired: boolean;
  }>;
  createdAt?: string;
}

interface RecruitmentSearchParams {
  keyword?: string;
  schoolId?: number;
  category?: string;
  status?: string;
  page?: number;
  size?: number;
}

// Fetch recruitments list with search/filter
export function useRecruitments(params: RecruitmentSearchParams = {}) {
  return useQuery({
    queryKey: ['recruitments', params],
    queryFn: async () => {
      const response = await recruitmentApi.search({
        keyword: params.keyword || undefined,
        schoolId: params.schoolId,
        category: params.category,
        status: params.status || 'PUBLISHED',
        page: params.page || 0,
        size: params.size || 20,
      });

      if (response.success && response.data) {
        // API returns List<RecruitmentResponseDto> directly, not PageResponse
        const allRecruitments: Recruitment[] = Array.isArray(response.data)
          ? response.data
          : (response.data as { content?: Recruitment[] }).content || [];

        // Client-side pagination
        const pageSize = params.size || 20;
        const currentPage = params.page || 0;
        const totalElements = allRecruitments.length;
        const totalPages = Math.ceil(totalElements / pageSize);
        const startIndex = currentPage * pageSize;
        const paginatedRecruitments = allRecruitments.slice(startIndex, startIndex + pageSize);

        return {
          recruitments: paginatedRecruitments,
          totalElements,
          totalPages,
          currentPage,
          hasNext: currentPage < totalPages - 1,
          hasPrevious: currentPage > 0,
        };
      }

      return {
        recruitments: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        hasNext: false,
        hasPrevious: false,
      };
    },
  });
}

// Fetch single recruitment detail
export function useRecruitment(recruitmentId: number | string) {
  return useQuery({
    queryKey: ['recruitment', recruitmentId],
    queryFn: async () => {
      const response = await recruitmentApi.getById(Number(recruitmentId));

      if (response.success && response.data) {
        return response.data as Recruitment;
      }

      throw new Error(response.error?.message || '모집공고를 불러오는데 실패했습니다.');
    },
    enabled: !!recruitmentId,
  });
}

// Apply to recruitment
export function useApplyRecruitment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recruitmentId,
      motivation,
      answers,
    }: {
      recruitmentId: number;
      motivation: string;
      answers: Record<string, unknown>;
    }) => {
      const response = await recruitmentApi.apply(recruitmentId, { motivation, answers });

      if (!response.success) {
        throw new Error(response.error?.message || '지원에 실패했습니다.');
      }

      return response.data;
    },
    onSuccess: (_, { recruitmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['recruitment', recruitmentId] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
}
