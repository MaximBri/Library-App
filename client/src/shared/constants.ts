export const APP_ROLES = {
  USER: 'user',
  LIBRARIAN: 'librarian',
  ADMIN: 'admin',
};

export type T_ROLES = 'user' | 'librarian' | 'admin';

export const RolesMap: Record<T_ROLES, string> = {
  user: 'пользователь',
  librarian: 'библиотекарь',
  admin: 'администратор',
};
