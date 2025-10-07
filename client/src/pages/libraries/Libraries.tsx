import { CreateLibrary } from '@/features/create-library/CreateLibrary';
import { EmptyList } from '@/features/empty-list/EmptyList';
import { useGetLibraries } from '@/shared/api/hooks/libraries/useGetLibraries';
import styles from './styles.module.scss';
import { useAuth } from '@/shared/hooks/useAuth';
import { APP_ROLES } from '@/shared/constants';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Library } from '@/features/library/Library';

export const Libraries = () => {
  const { data: librariesList, isLoading } = useGetLibraries();
  const { user } = useAuth();

  const [createLibraryIsOpen, setCreateLibraryIdOpen] =
    useState<boolean>(false);

  const handleCreateLibraryClick = () =>
    setCreateLibraryIdOpen((prev) => !prev);

  if (isLoading) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <>
      <div className={styles['libraries']}>
        {user?.role === APP_ROLES.ADMIN && (
          <button
            onClick={handleCreateLibraryClick}
            className={styles['libraries__add-button']}
          >
            +
          </button>
        )}
        <h2 className={styles['libraries__title']}>Библиотеки</h2>
        {librariesList?.map((library, index) => (
          <Library library={library} key={index} />
        ))}
        {!librariesList?.length && <EmptyList title="Библиотек пока нет :(" />}
      </div>
      {createLibraryIsOpen &&
        createPortal(
          <CreateLibrary handleClose={handleCreateLibraryClick} />,
          document.body
        )}
    </>
  );
};
