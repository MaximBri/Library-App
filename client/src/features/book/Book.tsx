import type { BookModel } from '@/shared/api/hooks/books/types';
import { useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import BookSvg from './icons/book.svg';
import styles from './styles.module.scss';
import { Button } from '../../shared/components/button/Button';
import ReserveBook from '../reserve-book/ReserveBook';
import { useAuth } from '@/shared/hooks/useAuth';
import EditSvg from './icons/edit.svg';
import DeleteSvg from './icons/delete.svg';
import { EditBook } from '../edit-book/EditBook';
import { DeleteBook } from '../delete-book/DeleteBook';

export const Book: FC<{ data: BookModel }> = ({ data }) => {
  const { id } = useParams();
  const { myLibrary } = useAuth();

  const [isReservedModalOpen, setIsReserverdModalOpen] =
    useState<boolean>(false);
  const [isUpdateBookModalOpen, setIsUpdateBookModalOpen] =
    useState<boolean>(false);
  const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] =
    useState<boolean>(false);

  const handleChangeReservedModal = (arg: boolean) =>
    setIsReserverdModalOpen((prev) => (arg ? arg : !prev));

  const isOwner = id === String(myLibrary?.id);

  return (
    <>
      <article
        className={styles.book}
        aria-labelledby={`book-title-${data.id}`}
      >
        {isOwner && (
          <div className={styles['book__nav']}>
            <button
              onClick={() => setIsUpdateBookModalOpen(true)}
              className={styles['book__nav-item']}
            >
              <img src={EditSvg} alt="edit" />
            </button>
            <button
              onClick={() => setIsDeleteBookModalOpen(true)}
              className={styles['book__nav-item']}
            >
              <img src={DeleteSvg} alt="delete" />
            </button>
          </div>
        )}
        <div className={styles.book__accent} aria-hidden="true" />

        <div className={styles.book__link} title={data.name}>
          <div className={styles.book__cover}>
            <img src={BookSvg} alt="" aria-hidden="true" />
          </div>

          <div className={styles.book__main}>
            <h3 id={`book-title-${data.id}`} className={styles['book__title']}>
              {data.name}
            </h3>
            <p className={styles['book__author']}>{data.author}</p>
            <p className={styles['book__theme']}>{data.theme}</p>
          </div>
        </div>

        <div className={styles.book__controls}>
          <Button
            className={styles.book__button}
            onClick={() => handleChangeReservedModal(true)}
            isDisabled={data.isReserved}
            text={data.isReserved ? 'Недоступна' : 'Забронировать'}
          />
        </div>

        {data.isReserved && (
          <div className={styles.book__overlay} aria-hidden="true">
            <span className={styles.book__badge}>Зарезервировано</span>
          </div>
        )}
      </article>
      <ReserveBook
        bookId={data.id}
        isOpen={isReservedModalOpen}
        handleClose={() => setIsReserverdModalOpen(false)}
      />
      <EditBook
        isOpen={isUpdateBookModalOpen}
        handleClose={() => setIsUpdateBookModalOpen(false)}
        data={data}
      />
      <DeleteBook
        isOpen={isDeleteBookModalOpen}
        handleClose={() => setIsDeleteBookModalOpen(false)}
        bookData={data}
      />
    </>
  );
};
