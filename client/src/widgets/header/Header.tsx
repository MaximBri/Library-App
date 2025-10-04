import { APP_ROUTES } from '@/shared/routes';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import styles from './styles.module.scss';

export const Header = () => {
  const { user } = useAuth();

  const username =
    user?.name && user?.surname
      ? `${user.name} ${user.surname.slice(0, 1)}.`
      : user?.email;

  return (
    <header className={styles['header']}>
      <Link to={APP_ROUTES.HOME}>
        <img src="/vite.svg" alt="logo" />
      </Link>
      <nav className={styles['header__nav']}>
        <Link to={APP_ROUTES.LIBRARIES}>Библиотеки</Link>
        <Link to={APP_ROUTES.BOOKS}>Книги</Link>
        <Link to={APP_ROUTES.USERS}>Пользователи</Link>
        <Link to={APP_ROUTES.LK}>{username}</Link>
      </nav>
    </header>
  );
};
