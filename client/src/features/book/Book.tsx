import type { BookModel } from '@/shared/api/hooks/books/types';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import BookSvg from './icons/book.svg';
import styles from './styles.module.scss';
import { Button } from '../button/Button';

export const Book: FC<{ data: BookModel }> = ({ data }) => {
  return (
    <div className={styles['book']}>
      <Link to={`${data.id}`} className={styles['book__link']}>
        <img src={BookSvg} alt="book" className={styles['book__image']} />
        <div className={styles['book__main']}>
          <h3 className={styles['book__main-title']}>{data.name}</h3>
          <h4 className={styles['book__main-author']}>{data.author}</h4>
          <h4 className={styles['book__main-theme']}>{data.theme}</h4>
        </div>
      </Link>
      <Button className={styles['book__button']} text="Забронировать"></Button>
    </div>
  );
};
