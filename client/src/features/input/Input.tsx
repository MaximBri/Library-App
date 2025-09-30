import type { FC } from 'react';
import styles from './styles.module.scss';

export const Input: FC<{
  className?: string;
  isEditing?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  name?: string;
}> = ({
  className = '',
  isEditing = true,
  value,
  placeholder = '',
  type = 'text',
  ...props
}) => {
  return isEditing ? (
    <input
      className={`${styles.input} ${className}`}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  ) : (
    <div className={`${styles.input} ${className}`}>{value || placeholder}</div>
  );
};
