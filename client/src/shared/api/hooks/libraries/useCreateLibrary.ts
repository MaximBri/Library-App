import { useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../../libraries/libraryApi';
import type { LibraryCreateModel } from './types';

export const useCreateLibrary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LibraryCreateModel) =>
      await libraryApi.createLibrary(data),
    onSuccess: () => {
      const cache = queryClient.getQueryData(['libraries']);
      console.log(cache);
    },
  });
};
