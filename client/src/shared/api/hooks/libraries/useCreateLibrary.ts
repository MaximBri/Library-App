import { useMutation } from '@tanstack/react-query';
import { libraryApi } from '../../libraries/libraryApi';
import type { LibraryCreateModel } from './types';

export const useCreateLibrary = () => {
  return useMutation({
    mutationFn: async (data: LibraryCreateModel) =>
      await libraryApi.createLibrary(data),
    onSuccess: () => {
      console.log('Библиотека создана');
    },
  });
};
