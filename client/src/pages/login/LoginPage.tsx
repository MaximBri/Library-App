import { LoginForm } from '@/features/login-form/LoginForm';
import { APP_ROUTES } from '@/shared/routes';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss'

export const LoginPage = () => {
  return (
    <div className={styles.login}>
      <h2 className={styles.login__title}>Вход в библиотеку</h2>
      <LoginForm />
      <div className={styles.login__about}>
        Нет аккаунта? <Link to={APP_ROUTES.REGISTER}>Зарегистрироваться</Link>
      </div>
    </div>
  );
};
