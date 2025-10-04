import { Input } from '@/features/input/Input';
import { RolesMap, type T_ROLES } from '@/shared/constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState } from 'react';
import styles from './styles.module.scss';
import { fields, updateUserDataSchema } from './constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/features/button/Button';
import type { UpdateUserForm } from './types';
import { useUpdateUserData } from '@/shared/api/hooks/user/useUpdateUserData';

export const LK = () => {
  const { user } = useAuth();
  const { mutate: updateUserData } = useUpdateUserData();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { register, handleSubmit, getValues } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: { name: user?.name || '', surname: user?.surname || '' },
  });

  const handleButtonClick = () => {
    setIsEdit((prev) => !prev);
  };

  const onSubmit = async (data: UpdateUserForm) => {
    updateUserData(data);
  };

  return (
    <div className={styles['lk']}>
      <h2 className={styles['lk__title']}>Личный кабинет</h2>
      <section>
        <h3 className={styles['lk__role']}>
          Роль: <strong>{RolesMap[user?.role as T_ROLES]}</strong>
        </h3>
        <form className={styles['lk__form']} onSubmit={handleSubmit(onSubmit)}>
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
          {isEdit ? (
            <Button type="submit" text="Сохранить"></Button>
          ) : (
            <Button onClick={handleButtonClick} text="Редактировать"></Button>
          )}
        </form>
      </section>
    </div>
  );
};
