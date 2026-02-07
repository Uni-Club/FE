import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi, PageResponse } from '@/lib/api';

export interface Club {
  groupId: number;
  groupName: string;
  description: string;
  category?: string;
  memberCount?: number;
  schoolId?: number;
  schoolName?: string;
  isUnion?: boolean;
  leaderName?: string;
  activeRecruitmentCount?: number;
  boardCount?: number;
  tags?: string[];
  createdAt?: string;
}

interface ClubSearchParams {
  keyword?: string;
  schoolId?: number;
  isUnion?: boolean;
  category?: string;
  page?: number;
  size?: number;
  sort?: 'latest' | 'popular' | 'members';
}

// Fetch clubs list with search/filter
export function useClubs(params: ClubSearchParams = {}) {
  return useQuery({
    queryKey: ['clubs', params],
    queryFn: async () => {
      const response = await groupApi.search({
        keyword: params.keyword || undefined,
        schoolId: params.schoolId,
        isUnion: params.isUnion,
        page: params.page || 0,
        size: params.size || 20,
      });

      if (response.success && response.data) {
        // API returns List<GroupResponseDto> directly, not PageResponse
        let clubs: Club[] = Array.isArray(response.data)
          ? response.data
          : (response.data as PageResponse<Club>).content || [];

        // Client-side sorting (API doesn't support sort param)
        if (params.sort === 'popular') {
          clubs = [...clubs].sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
        } else if (params.sort === 'members') {
          clubs = [...clubs].sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
        }
        // 'latest' is default from API

        // Client-side category filter (if API doesn't support it)
        if (params.category && params.category !== '전체') {
          clubs = clubs.filter((club) => club.category === params.category);
        }

        // Client-side pagination
        const pageSize = params.size || 20;
        const currentPage = params.page || 0;
        const totalElements = clubs.length;
        const totalPages = Math.ceil(totalElements / pageSize);
        const startIndex = currentPage * pageSize;
        const paginatedClubs = clubs.slice(startIndex, startIndex + pageSize);

        return {
          clubs: paginatedClubs,
          totalElements,
          totalPages,
          currentPage,
          hasNext: currentPage < totalPages - 1,
          hasPrevious: currentPage > 0,
        };
      }

      return {
        clubs: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        hasNext: false,
        hasPrevious: false,
      };
    },
  });
}

// Fetch single club detail
export function useClub(groupId: number | string) {
  return useQuery({
    queryKey: ['club', groupId],
    queryFn: async () => {
      const response = await groupApi.getById(Number(groupId));

      if (response.success && response.data) {
        return response.data as Club;
      }

      throw new Error(response.error?.message || '동아리 정보를 불러오는데 실패했습니다.');
    },
    enabled: !!groupId,
  });
}

// Fetch club members
export function useClubMembers(groupId: number | string, role?: string) {
  return useQuery({
    queryKey: ['club', groupId, 'members', role],
    queryFn: async () => {
      const response = await groupApi.getMembers(Number(groupId), role);

      if (response.success && response.data) {
        return response.data as Array<{
          userId: number;
          name: string;
          role: string;
          joinedAt: string;
        }>;
      }

      return [];
    },
    enabled: !!groupId,
  });
}

// Request to leave club
export function useLeaveClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, reason }: { groupId: number; reason: string }) => {
      const response = await groupApi.requestLeave(groupId, reason);

      if (!response.success) {
        throw new Error(response.error?.message || '탈퇴 신청에 실패했습니다.');
      }

      return response.data;
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['club', groupId] });
      queryClient.invalidateQueries({ queryKey: ['myGroups'] });
    },
  });
}
