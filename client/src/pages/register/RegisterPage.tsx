import { RegisterForm } from '@/features/register-form/RegisterForm';
import { APP_ROUTES } from '@/shared/routes';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export const RegisterPage = () => {
  return (
    <div className={styles.register}>
      <h2 className={styles.register__title}>Регистрация</h2>
      <RegisterForm />
      <div className={styles.register__about}>
        Уже есть аккаунт? <Link to={APP_ROUTES.LOGIN}>Войти</Link>
      </div>
    </div>
  );
};
