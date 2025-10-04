import { Input } from '@/features/input/Input';
import { RolesMap, type T_ROLES } from '@/shared/constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState, type MouseEvent } from 'react';
import styles from './styles.module.scss';
import { fields, updateUserDataSchema } from './constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/features/button/Button';
import type { UpdateUserForm } from './types';
import { useUpdateUserData } from '@/shared/api/hooks/user/useUpdateUserData';
import { ChangeRole } from '@/features/change-role/ChangeRole';

export const LK = () => {
  const { user } = useAuth();
  const { mutate: updateUserData, isPending } = useUpdateUserData();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { register, handleSubmit, getValues } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: { name: user?.name || '', surname: user?.surname || '' },
  });

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEdit((prev) => !prev);
  };

  const onSubmit = async (data: UpdateUserForm) => {
    updateUserData(data);
    setIsEdit((prev) => !prev);
  };

  return (
    <div className={styles['lk']}>
      <h2 className={styles['lk__title']}>Личный кабинет</h2>
      <section>
        <h3 className={styles['lk__role']}>ID: {user?.id}</h3>
        <h3 className={styles['lk__role']}>Email: {user?.email}</h3>
        <h3 className={styles['lk__role']}>
          Роль: <strong>{RolesMap[user?.role as T_ROLES]}</strong>
        </h3>
        <form
          className={styles['lk__form-wrapper']}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles['lk__form']}>
            {fields.map((field) => (
              <label className={styles['lk__form-label']}>
                {field.placeholder}
                <Input
                  className={`${styles['lk__form-input']} ${
                    !isEdit ? styles['lk__form-input--disabled'] : ''
                  }`}
                  value={getValues(field.value as keyof UpdateUserForm)}
                  isEditing={isEdit}
                  placeholder={field.placeholder}
                  {...register(field.name as keyof UpdateUserForm)}
                ></Input>
              </label>
            ))}
          </div>
          {isEdit ? (
            <Button
              className={styles['lk__form-button']}
              isDisabled={isPending}
              type="submit"
              text="Сохранить"
              isLoading={isPending}
            ></Button>
          ) : (
            <Button
              type="button"
              className={styles['lk__form-button']}
              onClick={handleButtonClick}
              text="Редактировать"
            ></Button>
          )}
        </form>
      </section>
      <ChangeRole />
    </div>
  );
};
