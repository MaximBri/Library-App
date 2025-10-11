import { type User } from './useAuth';

export const useGetUserName = (
  user?: User,
  fullName: boolean = false
): string => {
  return user?.name && user?.surname
    ? `${user.name} ${fullName ? user.surname : user.surname.slice(0, 1)}.`
    : user?.email || '';
};
