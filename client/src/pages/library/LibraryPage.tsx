import { useParams } from 'react-router-dom';

export const LibraryPage = () => {
  const { id } = useParams();
  return <div>LibraryPage</div>;
};
