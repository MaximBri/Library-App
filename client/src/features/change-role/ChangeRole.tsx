import { useForm } from 'react-hook-form';
import type { UpdateUserRoleForm } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserRoleSchema } from './constants';
import { Input } from '../../shared/components/input/Input';
import { APP_ROLES, RolesMap } from '@/shared/constants';
import { Button } from '../../shared/components/button/Button';
import { useUpdateUserRole } from '@/shared/api/hooks/user/useUpdateUserRole';
import { useAuth } from '@/shared/hooks/useAuth';
import styles from './styles.module.scss';
import { notify } from '@/shared/utils/notify';

export const ChangeRole = () => {
  const { user } = useAuth();
  const { mutate: updateUserRole } = useUpdateUserRole();
  const { register, handleSubmit, getValues } = useForm<UpdateUserRoleForm>({
    resolver: zodResolver(updateUserRoleSchema),
  });

  const onSubmit = (data: UpdateUserRoleForm) => {
    updateUserRole(data, {
      onSuccess: () => {
        notify('Роль пользователя обновлена!', 'success')
      },
      onError: () => {
        notify('Ошибка при обновлении роли пользователя', 'error')
      }
    });
  };

  if (user?.role !== APP_ROLES.ADMIN) {
    return null;
  }

  return (
    <section className={styles['change']}>
      <h2>Изменить роль пользователю</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['change__form']}
        autoComplete='off'
      >
        <Input
          {...register('id')}
          value={getValues('id')}
          placeholder="ID пользователя"
        ></Input>
        <Input
          {...register('role')}
          value={getValues('role')}
          placeholder="Роль пользователя"
          options={Object.values(RolesMap)}
        ></Input>
        <Button
          type="submit"
          text="Изменить"
          className={styles['change__form-button']}
        ></Button>
      </form>
    </section>
  );
};
