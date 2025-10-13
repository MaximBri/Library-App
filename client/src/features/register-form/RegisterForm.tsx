import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../shared/hooks/useAuth';
import { Input } from '../../shared/components/input/Input';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/shared/routes';
import { useState, type FC } from 'react';
import styles from './styles.module.scss';
import { Button } from '../../shared/components/button/Button';

const schema = z.object({
  email: z.string(),
  password: z.string().min(4),
});

type Form = z.infer<typeof schema>;

export const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const { register: regFn, user } = useAuth();
  const { register, handleSubmit, formState, getValues } = useForm<Form>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: Form) => {
    try {
      setError('');
      await regFn(data.email, data.password);
      navigate(APP_ROUTES.HOME);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Ошибка при регистрации');
    }
  };

  if (user) {
    navigate(APP_ROUTES.HOME);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        value={getValues().email}
        placeholder="E-mail"
        {...register('email')}
      />
      <Input
        value={getValues().password}
        placeholder="Пароль"
        type="password"
        {...register('password')}
      />
      {error && <span>{error}</span>}
      <Button
        type="submit"
        text="Зарегистрироваться"
        isDisabled={formState.isSubmitting}
        isLoading={formState.isSubmitting}
      />
    </form>
  );
};
