import { CreateLibrary } from '@/features/create-library/CreateLibrary';
import { EmptyList } from '@/features/empty-list/EmptyList';
import { useGetLibraries } from '@/shared/api/hooks/libraries/useGetLibraries';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export const Libraries = () => {
  const { data: librariesList, isLoading } = useGetLibraries();

  if (isLoading) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div className={styles['libraries']}>
      <h2 className={styles['libraries__title']}>Библиотеки</h2>
      {librariesList?.map((library) => (
        <Link to={'/'}></Link>
      ))}
      {!librariesList?.length && <EmptyList title="Библиотек пока нет :(" />}
      <CreateLibrary />
    </div>
  );
};
