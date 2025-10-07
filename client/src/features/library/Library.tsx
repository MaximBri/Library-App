import type { LibraryModel } from '@/shared/api/hooks/libraries/types';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export const Library: FC<{ library: LibraryModel }> = ({ library }) => {
  const librarian = library.librarian;

  return (
    <Link className={styles['library']} to={`/libraries/${library.id}`}>
      <h2 className={styles['library__name']}>{library.name}</h2>
      <h3 className={styles['library__address']}>{library.address}</h3>
      <h4 className={styles['library__librarian']}>
        Библиотекарь: {`${librarian?.surname} ${librarian?.name}`}
      </h4>
    </Link>
  );
};
