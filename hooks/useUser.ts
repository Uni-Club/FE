import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api';

// Fetch user's joined groups
export function useMyGroups() {
  return useQuery({
    queryKey: ['myGroups'],
    queryFn: async () => {
      const response = await userApi.getMyGroups();

      if (response.success && response.data) {
        return response.data as Array<{
          groupId: number;
          groupName: string;
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
            group: {
              groupId: number;
              groupName: string;
            };
          };
          createdAt: string;
        }>;
      }

      return [];
    },
  });
}
