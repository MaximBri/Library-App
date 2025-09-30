import { Input } from '@/features/input/Input';
import { RolesMap, type T_ROLES } from '@/shared/constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState } from 'react';
import styles from './styles.module.scss';
import { fields } from './constants';

export const LK = () => {
  const { user } = useAuth();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleButtonClick = () => {
    setIsEdit((prev) => !prev);
  };

  return (
    <div className={styles['lk']}>
      <h2 className={styles['lk__title']}>Личный кабинет</h2>
      <section>
        <h3 className={styles['lk__role']}>
          Роль: <strong>{RolesMap[user?.role as T_ROLES]}</strong>
        </h3>
        <form className={styles['lk__form']}>
          {fields.map((field) => (
            <label className={styles['lk__form-label']}>
              {field.placeholder}
              <Input
                className={`${styles['lk__form-input']} ${
                  !isEdit ? styles['lk__form-input--disabled'] : ''
                }`}
                value={user?.[field.value] || ''}
                isEditing={isEdit}
                placeholder={field.placeholder}
                name={field.name}
              ></Input>
            </label>
          ))}
        </form>
        <button onClick={handleButtonClick}>
          {isEdit ? 'Сохранить' : 'Редактировать'}
        </button>
      </section>
    </div>
  );
};
