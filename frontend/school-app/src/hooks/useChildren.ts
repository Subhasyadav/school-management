import { useQuery } from '@tanstack/react-query';
// import { childrenService } from '../api/childrenService';
// import type { UserResponse } from '../types/user';
import type { PageResponse } from '../types/user';
import type { UserResponse } from '../types/profile';
import { childrenService } from '../api/childerenService';

export const useChildren = (parentId: number | undefined, enabled = true) => {
  return useQuery<PageResponse<UserResponse>>({
    queryKey: ['children', parentId],
    queryFn: () => childrenService.getChildren(parentId!).then((res) => res.data),
    enabled: !!parentId && enabled,
  });
};