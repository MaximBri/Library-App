import type { FC } from 'react';
import type { ButtonType } from '@/shared/types';
import styles from './styles.module.scss';
import LoaderSvg from '@/shared/icons/loader.svg';

export const Button: FC<{
  className?: string;
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  type?: ButtonType;
  isLoading?: boolean;
}> = (
  { className, text, onClick, isDisabled, type, isLoading = false },
  ...props
) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {isLoading ? (
        <img
          className={styles['button__loader']}
          src={LoaderSvg}
          alt="loading..."
        />
      ) : (
        text
      )}
    </button>
  );
};
