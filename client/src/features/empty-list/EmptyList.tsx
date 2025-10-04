import { type FC } from 'react';

import EmptyPng from './icons/empty.png';
import styles from './styles.module.scss';

export const EmptyList: FC<{ title: string }> = ({ title }) => {
  return (
    <div className={styles['empty']}>
      <img className={styles['empty__image']} src={EmptyPng} alt="empty"></img>
      <h3 className={styles['empty__title']}>{title}</h3>
    </div>
  );
};
