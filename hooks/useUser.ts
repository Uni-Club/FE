import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api';

// Fetch user's joined clubs
export function useMyClubs() {
  return useQuery({
    queryKey: ['myClubs'],
    queryFn: async () => {
      const response = await userApi.getMyClubs();

      if (response.success && response.data) {
        return response.data as Array<{
          clubId: number;
          clubName: string;
          role: string;
          joinedAt: string;
        }>;
      }

      return [];
    },
  });
}

// Fetch user's applications
export function useMyApplications(status?: string) {
  return useQuery({
    queryKey: ['myApplications', status],
    queryFn: async () => {
      const response = await userApi.getMyApplications(status);

      if (response.success && response.data) {
        return response.data as Array<{
          applicationId: number;
          status: string;
          recruitment: {
            recruitmentId: number;
            title: string;
            club: {
              clubId: number;
              clubName: string;
            };
          };
          createdAt: string;
        }>;
      }

      return [];
    },
  });
}
