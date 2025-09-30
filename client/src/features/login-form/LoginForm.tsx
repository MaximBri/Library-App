import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../shared/hooks/useAuth';
import { Input } from '../input/Input';
import { APP_ROUTES } from '@/shared/routes';
import styles from './styles.module.scss';
import { Button } from '../button/Button';

const schema = z.object({
  email: z.string(),
  password: z.string().min(4),
});

type Form = z.infer<typeof schema>;

export const LoginForm: FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { register, handleSubmit, formState, getValues } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password);
      navigate(APP_ROUTES.HOME);
    } catch (err) {
      console.error(err);
    }
  };

  if (user) {
    navigate(APP_ROUTES.HOME);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        placeholder="E-mail"
        value={getValues('email')}
        {...register('email')}
      />
      <Input
        value={getValues('password')}
        {...register('password')}
        type="password"
        placeholder="Пароль"
      />
      <Button
        text="Войти"
        type="submit"
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
      />
    </form>
  );
};
