import { APP_ROUTES } from '@/shared/routes';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import styles from './styles.module.scss';
import { APP_ROLES } from '@/shared/constants';

export const Header = () => {
  const { user, isAuthorized, myLibrary } = useAuth();

  const username =
    user?.name && user?.surname
      ? `${user.name} ${user.surname.slice(0, 1)}.`
      : user?.email;
  const isAdmin = user?.role === APP_ROLES.ADMIN;

  return (
    <header className={styles['header']}>
      <Link to={APP_ROUTES.HOME}>
        <img src="/vite.svg" alt="logo" />
      </Link>
      <nav className={styles['header__nav']}>
        <Link to={APP_ROUTES.LIBRARIES}>Библиотеки</Link>
        <Link to={APP_ROUTES.BOOKS}>Книги</Link>
        {myLibrary && (
          <Link to={`${APP_ROUTES.LIBRARIES}/${myLibrary.id}`}>
            Моя библиотека
          </Link>
        )}
        {isAdmin && <Link to={APP_ROUTES.USERS}>Пользователи</Link>}
        {username && <Link to={APP_ROUTES.LK}>{username}</Link>}
        {isAuthorized === false && <Link to={APP_ROUTES.LOGIN}>Войти</Link>}
      </nav>
    </header>
  );
};
