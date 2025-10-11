import CreateBook from '@/features/create-book/CreateBook';
import { APP_ROLES } from '@/shared/constants';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import PlusSvg from '@/shared/icons/plus.svg';
import styles from './styles.module.scss';
import { useGetLibraryBooksInfinite } from '@/shared/api/hooks/books/useGetLibraryBooksInfinite';
import { Button } from '@/features/button/Button';
import { Book } from '@/features/book/Book';
import { EmptyList } from '@/features/empty-list/EmptyList';

export const LibraryPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetLibraryBooksInfinite(Number(id));

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState<boolean>(false);
  const handleChangeBookModal = () => setIsAddBookModalOpen((prev) => !prev);

  const isAdmin = user?.role === APP_ROLES.ADMIN;
  const isOwner = user?.id === data?.pages?.[0]?.library?.librarian?.id;
  const books = data?.pages.flatMap((page) => page.items) || [];

  return (
    <section className={styles['page']}>
      <div className={styles['page__header']}>
        <h1 className={styles['page__title']}>Книги библиотеки:</h1>
        {(isAdmin || isOwner) && (
          <button
            className={styles['page__add-button']}
            onClick={handleChangeBookModal}
          >
            <img
              className={styles['page__add-button-icon']}
              src={PlusSvg}
              alt="add book"
            />
          </button>
        )}
      </div>
      {books.length ? (
        <ul className={styles['page__list']}>
          {books.map((book) => {
            return <Book data={book} key={book.id} />;
          })}
        </ul>
      ) : (
        <EmptyList title="Книг в этой библиотеке пока нет :(" />
      )}
      {hasNextPage && !isFetchingNextPage && (
        <Button
          text="Загрузить ещё"
          onClick={() => fetchNextPage()}
          isDisabled={!hasNextPage || isFetchingNextPage}
        />
      )}

      {isAddBookModalOpen &&
        createPortal(
          <CreateBook handleClose={handleChangeBookModal} />,
          document.body
        )}
    </section>
  );
};
