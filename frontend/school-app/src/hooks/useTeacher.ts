// import { useQuery } from '@tanstack/react-query';
// import { userApi } from '../api/users';
// // import { userService } from '../api/userService'; // you need a service to fetch users by role

// export const useTeachers = (page = 0, size = 20, enabled = true) => {
//   return useQuery({
//     queryKey: ['teachers', page, size],
//     queryFn: () => userApi.getByRole('TEACHER', page, size).then((res) => res.data),
//     enabled,
//   });
// };

import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/users';
// import { userService } from '../api/userService'; // you need to create this

export const useTeachers = (page = 0, size = 20, enabled = true) => {
  return useQuery({
    queryKey: ['teachers', page, size],
    queryFn: () => userApi.getByRole('TEACHER', page, size).then((res) => res.data),
    enabled,
  });
};