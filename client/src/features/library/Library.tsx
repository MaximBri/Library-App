import { type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import type { LibraryModel } from '@/shared/providers/types';
import librarySvg from './icons/library.svg';

export const Library: FC<{ library: LibraryModel }> = ({ library }) => {
  const librarian = library.librarian;

  return (
    <Link className={styles.library} to={`/libraries/${library.id}`}>
      <div className={styles.library__accent} aria-hidden="true" />
      <div className={styles.library__image}>
        <img src={librarySvg} alt="library" />
      </div>
      <div className={styles.library__main}>
        <h2 className={styles.library__name}>{library.name}</h2>
        <h3 className={styles.library__address}>{library.address}</h3>
        <h4 className={styles.library__librarian}>
          Библиотекарь: <div>{`${librarian?.surname} ${librarian?.name}`}</div>
        </h4>
      </div>
    </Link>
  );
};
