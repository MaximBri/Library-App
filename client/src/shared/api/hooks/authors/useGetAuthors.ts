import { useQuery } from '@tanstack/react-query';
import { authorApi } from '../../authors/authorApi';

export const useGetAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: () => authorApi.getAuthors(),
    staleTime: Infinity,
  });
};

export default useGetAuthors;
