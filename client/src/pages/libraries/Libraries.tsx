import { CreateLibrary } from '@/features/create-library/CreateLibrary';
import { EmptyList } from '@/features/empty-list/EmptyList';
import { useGetLibraries } from '@/shared/api/hooks/libraries/useGetLibraries';
import styles from './styles.module.scss';
import { useAuth } from '@/shared/hooks/useAuth';
import { APP_ROLES } from '@/shared/constants';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Library } from '@/features/library/Library';
import PlusSvg from '@/shared/icons/plus.svg';

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
        <div className={styles['libraries__header']}>
          <h2 className={styles['libraries__title']}>Библиотеки</h2>
          {user?.role === APP_ROLES.ADMIN && (
            <button
              className={styles['libraries__add-button']}
              onClick={handleCreateLibraryClick}
            >
              <img
                className={styles['libraries__add-button-icon']}
                src={PlusSvg}
                alt="add library"
              />
            </button>
          )}
        </div>
        <ul className={styles['libraries__list']}>
          {librariesList?.map((library, index) => (
            <Library library={library} key={index} />
          ))}
        </ul>
        {!librariesList?.length && <EmptyList title="Библиотек пока нет :(" />}
      </div>
      <CreateLibrary
        isOpen={createLibraryIsOpen}
        handleClose={handleCreateLibraryClick}
      />
    </>
  );
};
