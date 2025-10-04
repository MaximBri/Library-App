import { CreateLibrary } from '@/features/create-library/CreateLibrary';
import { useGetLibraries } from '@/shared/api/hooks/libraries/useGetLibraries';
import { Link } from 'react-router-dom';

export const Libraries = () => {
  const { data: librariesList, isLoading } = useGetLibraries();

  if (isLoading) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div>
      <h2>Библиотеки</h2>
      {librariesList?.map((library) => (
        <Link to={'/'}></Link>
      ))}
      {!librariesList?.length && <h3>Библиотек пока нет :(</h3>}
      <CreateLibrary />
    </div>
  );
};
