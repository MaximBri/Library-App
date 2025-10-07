import type { LibraryModel } from '@/shared/providers/types';
import api from '../axios';
import type {
  LibraryCreateModel,
} from '../hooks/libraries/types';

export const libraryApi = {
  getLibraries: async () => {
    const { data } = await api.get<LibraryModel[]>('/api/libraries');
    return data;
  },

  getMyLibrary: async ():Promise<LibraryModel> => {
    const { data } = await api.get('/api/libraries/my');
    return data;
  },

  createLibrary: async (params: LibraryCreateModel) => {
    const { data } = await api.post('/api/libraries', {
      ...params,
      librarianId: Number(params.librarianId),
    });
    return data;
  },
};
